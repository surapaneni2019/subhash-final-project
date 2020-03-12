const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db.js");
const { hash, compare } = require("./util/bc.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const ses = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");
const secretCode = cryptoRandomString({
    length: 6
});
const s3 = require("./s3.js");

//////////FILE UPLOAD BOILERPLATE CODE /////////////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { s3Url } = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

//the uploader is an object
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//////////FILE UPLOAD BOILERPLATE CODE ENDS HERE/////////////////

app.use(compression());

app.use(express.static("./public"));
app.use(
    express.urlencoded({
        extended: false
    })
);

//communicating to the server that we will be sending the JSON format
app.use(express.json());
app.use((req, res, next) => {
    next();
});

//cookieSession
//max age is to set how long the cookie should live inthiscase it survives for
//2weeks of inactivity..

app.use(
    cookieSession({
        secret: `The secret is used to generate the second cookie used to verify
    the integrity of the first cookie`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

// app.use(express.json());
// app.use(require('cookie-session') ({
//     secret: 'whatever'
//     maxAge: 1000 * 60 * 60 *24 * 365
// })
// );

app.use(csurf());
//we keep the token in a cookie and it matches the things you pass on ..
app.use((req, res, next) => {
    res.set("x-frame-options", "deny");
    res.cookie("csrfToken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("./welcome", function(req, res) {
    // console.log("cookie", req.session.userId);
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration/submit", (req, res) => {
    console.log("req.body: ", req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    console.log("res: ", res);

    hash(password).then(hashedPw => {
        console.log("hashed password from /register: ", hashedPw);
        password = hashedPw;
        db.registerUser(first, last, email, password)
            .then(function(result) {
                //console.log("result in registerUser: ", result);
                //we are here setting the req.session.userId in the below cmd line..
                req.session.userId = result.rows[0].id;
                console.log(
                    "req.session.userId in registrations form: ",
                    req.session.userId
                );
                return res.json(result);
            })
            .catch(function(error) {
                console.log("error in registration/submit: ", error);
                return res.json({ error: true });
            });
    });
});
app.post("/login/submit", (req, res) => {
    console.log("req.body", req.body);
    let email = req.body.email;
    let password = req.body.password;

    db.verifyUser(email)
        .then(result => {
            // console.log("result in db.verifyUser", result);
            //console.log("result.rows[0].password", result.rows[0].password);
            // console.log("result.rows[0]", result.rows[0]);
            // if (result.rows[0] === undefined) {
            //     return res.json({ error: true }); returns an error if no matching pasw
            // }
            console.log("result.rows.length", result.rows.length);
            if (result.rows.length === 0) {
                return res.json({ error: true });
            }
            let passwordDB = result.rows[0].password;
            compare(password, passwordDB)
                .then(matchValue => {
                    console.log("matchValue of compare", matchValue);
                    if (matchValue) {
                        console.log("result: if match value is true", result);
                        console.log("result.rows[0].id", result.rows[0].id);

                        let id = result.rows[0].id;
                        req.session.userId = id;
                        console.log("req.session.userId", req.session.userId);

                        return res.json(result);
                    } else {
                        return res.sendStatus(500);
                    }
                })
                .catch(error => {
                    console.log("error", error);
                    return res.sendStatus(500);
                    // return res.redirect(500, "/welcome");
                });
        })
        .catch(error => {
            console.log("error", error);
            return res.redirect(500, "/welcome");
        });
});

app.post("/password/reset/start", (req, res) => {
    let email = req.body.email;
    let subject = "hey Subhash";
    let code = cryptoRandomString({ length: 10 });
    let message = code;

    db.verifyUser(email)
        .then(result => {
            console.log("code: ", code);

            db.insertResetCode(email, code)
                .then(result => {
                    return ses.sendEmail(email, subject, message);
                })
                .then(result => {
                    return res.json({ reset: true });
                })
                .catch(error => {
                    console.log("error: ", error);
                    return res.sendStatus(500);
                });
        })
        .catch(error => {
            console.log("error: ", error);
            return res.sendStatus(500);
        });
});

app.post("/password/reset/verify", (req, res) => {
    let inputCode = req.body.code;
    let password = req.body.password;
    let id = req.session.userId;
    console.log("inputCode: ", inputCode);
    console.log("req.body.password: ", req.body.password);

    db.verifyCode()
        .then(result => {
            const matchingitem = result.rows.filter(
                item => item.code === inputCode
            );

            let codeDB = matchingitem[0].code;
            codeDB.trim();
            inputCode.trim();
            console.log("codeDB", codeDB);
            console.log("inputCode", inputCode);

            if (codeDB === inputCode) {
                hash(password)
                    .then(hashedPw => {
                        console.log(
                            "hashed password from /password/reset/verify",
                            hashedPw
                        );
                        password = hashedPw;

                        req.session.userID = matchingitem[0].id;

                        db.updatePassword(password, id)
                            .then(result => {
                                return res.json({ verified: true });
                            })
                            .catch(error => {
                                console.log("error", error);
                                return res.sendStatus(500);
                            });
                    })
                    .catch(err => {
                        console.log("error", err);
                        return res.sendStatus(500);
                    });
            } else {
                return res.sendStatus(500);
            }
        })
        .catch(err => {
            console.log("error", err);
            return res.sendStatus(500);
        });
});

///get user route ///
app.get("/user", (req, res) => {
    console.log("req.session.userId", req.session.userId);
    res.json({ id: req.session.userId });
});

/// upload profile pic ///
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("input", req.body);
    console.log("file:", req.file);

    if (req.file) {
        let url = s3Url + req.file.filename;
        console.log(url);
        let id = req.session.userId;

        db.addImage(url, id)
            .then(function(result) {
                console.log("image result");
                console.log(result.rows[0].image);
                res.json({
                    image: result.rows[0].image
                });
            })
            .catch(error => {
                console.log("error in upload: ", error);
            });
    } else {
        res.json({
            success: false
        });
    }

    // if (req.file) {
    //     console.log("req.file.filename", req.file.filename);
    //
    //     const url = s3Url.concat(req.file.filename);
    //     console.log("your Image Url: ", url);
    //
    //     return res.json(url);
    // } else {
    //     return res.sendStatus(500);
    // }
});

//DONOT DELETE OR COMMENT IT OUT BELOW CODE
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//DONOT DELETE OR COMMENT IT OUT ABOVE CODE
app.listen(8080, function() {
    console.log("I am listening.");
});
