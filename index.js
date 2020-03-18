const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 mysocialnetworkapp.herokuapp.com:*"
});

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

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.static("./public"));

app.use(express.json());
app.use((req, res, next) => {
    next();
});

app.use(compression());

//communicating to the server that we will be sending the JSON format

//cookieSession
//max age is to set how long the cookie should live inthiscase it survives for
//2weeks of inactivity..

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// app.use(
//     cookieSession({
//         secret: `The secret is used to generate the second cookie used to verify
//     the integrity of the first cookie`,
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );

app.use(csurf());
//we keep the token in a cookie and it matches the things you pass on ..
app.use((req, res, next) => {
    res.set("x-frame-options", "deny");
    res.cookie("mytoken", req.csrfToken());
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

app.get("/welcome", function(req, res) {
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
    let message =
        "Please use the following code to reset your password of your HelpMe Account: " +
        secretCode;
    console.log("secretCode: ", secretCode);

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
    let id = req.session.userId;
    // console.log("req.session.userId", req.session.userId);
    db.getInfoUser(id)
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.json(rows[0]);
        })
        .catch(error => {
            console.log("error in getUser: ", error);
            return res.sendStatus(500);
        });
});

//id for others profile
app.get("/user/profile/:id", (req, res) => {
    let id = req.params.id.replace(".json", "");

    if (id === req.session.userId) {
        return res.json({ redirectTo: "/" });
    }

    db.getInfoUser(id)
        .then(result => {
            res.json({
                result
            });
        })
        .catch(error => {
            console.log("error in otherprofiles id", error);
            return res.sendStatus(500);
        });
});

/// upload profile pic ///
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("input", req.body);
    console.log("file:", req.file);

    if (req.file) {
        let url = s3Url + req.file.filename;
        console.log("your image url: ", url);
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
                console.log("error in uploading Image: ", error);
            });
    } else {
        res.json({
            success: false
        });
    }
});

/////submit bio //////
app.post("/uploadbio", (req, res) => {
    let id = req.session.userId;
    let bio = req.body.bio;
    console.log("bio", bio);

    console.log("req.body", req.body);

    db.addBio(id, bio)
        .then(function(result) {
            console.log("result: ", result);
            return res.json(bio);
        })
        .catch(function(error) {
            console.log("error in addBio: ", error);
        });
});

/////find users //////
//the get request url
app.get("/api/recentusers", (req, res) => {
    let user_id = req.session.userId;
    db.getRecentUsers()
        .then(function(result) {
            const data = result.rows;
            const filtered = data.filter(element => element.id !== user_id);
            return res.json(filtered);
        })
        .catch(function(error) {
            console.log("error in getRecentUsers: ", error);
        });
});

/////search users //////
app.get("/search/:val", (req, res) => {
    let val = req.params.val;
    let user_id = req.session.userId;
    console.log("user_id", user_id);
    db.getMatchingUsers(val)
        .then(function(result) {
            const data = result.rows;
            //preventing users to find themselves in the search
            const filtered = data.filter(element => element.id !== user_id);
            return res.status(200).json(filtered);
        })
        .catch(function(error) {
            console.log("error in getMatchingUsers: ", error);
        });
});

/////friendship: figure out status //////
app.get("/friends/:id", (req, res) => {
    let otherUser_id = req.params.id;
    let user_id = req.session.userId;
    console.log("otherUser_id", otherUser_id);
    console.log("user_id", user_id);

    db.getFriendshipStatus(otherUser_id, user_id)
        .then(function(result) {
            console.log(
                "result from friendschip status: result.rows[0]",
                result.rows[0]
            );

            let data = result.rows[0];
            return res.status(200).json({ data });
        })
        .catch(function(error) {
            console.log("error in get /starting-friendship-status: ", error);
        });
});

////////////////////Make Friend Request ////////////
app.post("/make-friend-request/:id", (req, res) => {
    let otherUser_id = req.params.id;
    let user_id = req.session.userId;
    console.log("otherUser_id", otherUser_id);
    console.log("user_id", user_id);

    db.makeFriendRequest(otherUser_id, user_id)
        .then(function(result) {
            console.log(
                "result post request if button was MakeFriendRequest: ",
                result
            );
            return res.json(result);
        })
        .catch(function(error) {
            console.log(
                "error in post/request if button was MakeFriendRequest: ",
                error
            );
        });
});

/////Accept Friend Request //////
app.post("/accept-friend-request/:id", (req, res) => {
    let otherUser_id = req.params.id;
    let user_id = req.session.userId;
    console.log("otherUser_id", otherUser_id);
    console.log("user_id", user_id);

    db.acceptFriendRequest(otherUser_id, user_id)
        .then(function(result) {
            return res.json(result);
        })
        .catch(function(error) {
            console.log(
                "error in post/request if button is AcceptFriendRequest: ",
                error
            );
        });
});

//END OR CANCEL FRIENSHIP
app.post("/end-friendship/:id", (req, res) => {
    let otherUser_id = req.params.id;
    let user_id = req.session.userId;
    console.log("otherUser_id", otherUser_id);
    console.log("user_id", user_id);

    db.endFriendship(otherUser_id, user_id)
        .then(function(result) {
            //console.log("result post request /end friendship: ", result);
            return res.json(result);
        })
        .catch(function(error) {
            console.log("error in post/request /end friendship: ", error);
        });
});

//RETRIVE FRIENDS AND WANNABE
app.get("/friends-wannabes", (req, res) => {
    let user_id = req.session.userId;
    console.log("user_id", user_id);

    db.getFriendsWannabes(user_id)
        .then(function(result) {
            console.log("result /getFriendsWannabes: ", result.rows[0]);
            return res.json(result.rows);
        })
        .catch(function(error) {
            console.log("error in /getFriendsWannabes: ", error);
        });
});

/////Accept Friend Request - FRIEND COMPO //////
app.post("/accept-friend-request", (req, res) => {
    console.log("req.body", req.body);
    let otherUser_id = req.body.user;
    let user_id = req.session.userId;
    console.log("otherUser_id", otherUser_id);
    console.log("user_id", user_id);

    db.acceptFriendRequest(otherUser_id, user_id)
        .then(function(result) {
            console.log("result post request /accept-friend-request", result);
            return res.json(result);
        })
        .catch(function(error) {
            console.log(
                "error in post/request if button is AcceptFriendRequest: ",
                error
            );
        });
});

//END OR CANCEL FRIENSHIP - FRIEND COMPO
app.post("/end-friendship", (req, res) => {
    console.log("req.body", req.body);
    let otherUser_id = req.body.user.id;
    let user_id = req.session.userId;
    console.log("otherUser_id", otherUser_id);
    console.log("user_id", user_id);

    db.endFriendship(otherUser_id, user_id)
        .then(function(result) {
            //console.log("result post request /end friendship: ", result);
            return res.json(result);
        })
        .catch(function(error) {
            console.log("error in post/request /end friendship: ", error);
        });
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
server.listen(8080, function() {
    console.log("I am listening.");
});

//server side socket code////
io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    /* ... */

    // if user make it here, it means they have logged into our socialnetwork
    //and they have succesfully connected to the sockets

    //we need to listenfor anew chatmessages being emitted...
    // socket.on("mufin", myMuffin => {
    //     console.log("myMuffin on the server: ", myMuffin);
    //     //emits a message to everyone to the socialnetwork
    //     io.sockets.emit("muffinMagic: ", myMuffin);
    // });

    socket.on("newMessages", msg => {
        console.log("msg: ", msg);
        // console.log("userId in newMessage: ", id);
        db.insertNewMessage(msg, userId).then(results => {
            // console.log('results.rows[0].id: ', results.rows[0].id);
            db.getMessageUser(results.rows[0].id).then(data => {
                console.log("data.rows: ", data.rows);
                io.sockets.emit("newMessages", data.rows);
            });
        });
    });
    // it is good time to go and get last 10 chat messages...
    db.getLastTenChatMessages()
        .then(results => {
            console.log("data.rows: ", results.rows);
            io.sockets.emit("chatMessages: ", results.rows.reverse());
        })
        .catch(error => {
            console.log("error in getLastTenChatMessages: ", error);
        });
});
