const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db.js");
const { hash } = require("./util/bc.js");
const cookieSession = require("cookie-session");

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

app.use(express.json());
app.use(require('cookie-session') ({
    secret: 'whatever'
    maxAge: 1000 * 60 * 60 *24 * 365
}));

app.use(require('csurf')());
app.use((req,res,next) => {
    res.set('x-frame-option', deny);
    res.cookie('funkychicken', req.csrfToken());
    next();
});













app.get("./welcome", function(req, res) {
    console.log("cookie", req.session.userId);
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
                //we are here setting the req.session.userId below
                req.session.userId = result.rows[0].id;
                console.log(
                    "req.session.userId in registration: ",
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

//DONOT DELETE OR COMMENT IT OUT BELOW CODE///
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
//DONOT DELETE OR COMMENT IT OUT ABOVE CODE///
app.listen(8080, function() {
    console.log("I'm listening.");
});
