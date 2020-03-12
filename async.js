// async and await
// async is a function that returns a promise
//we can only use await with a function using async
//async and await enables us to write asynchronous code that looks synchronous
//we catch errors with try and catch
//don't use async await in the front without babbel

//writing async function
//keyword async before keyword function

//await: will wait for the function to finish
//the function will wait for the function IN this order
//promise.all is a similar concept but in promise.all we wait for all the promises at the same time
//with async/await we wate for the functions in this order
// async function makePizza() {
//     await makeSauce();
//     await grateCheese();
//     await kneadDough();
// }

//in some situatuions we do want to wait from a function to be done
//before executing another one
//in our situation, it doesn't make sense to wait before each one is done
//before they are no co-dependent

//here all functions are executed at the same time
//and they all return promises (makesauce() returns a promise)
async function makePizza() {
    const { data } = await axios.get("/user");
    const sauceProm = makeSauce();
    const cheeseProm = grateCheese();
    const doughProm = kneadDough();

    const pizza = await Promise.all([sauceProm, cheeseProm, doughProm]);
}

//use async in a route
//put async keyword
//the hash and dbquery are asynchronous here
app.post("/registration/submit", async (req, res) => {
    const { first, last, email, password } = req.body;
    console.log("reqbody", req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;

    console.log("res", res);

    try {
        const hashedPassword = await bc.hash(password);
        const { rows } = await db.createUser(
            first,
            last,
            email,
            hashedPassword
        );
        req.session.userId = result.rows[0].id;
        return res.json({ success: true });
    } catch (err) {
        console.log(err);
        if (err.message === "cannot read property") {
            res.json({ success: false });
        }
    }

    // await hash(password).then(hashedPw => {
    //     console.log("hashed password from /register", hashedPw);
    //     password = hashedPw;
    //     db.registerUser(first, last, email, password)
    //         .then(function(result) {
    //             //console.log("result in registerUser", result);
    //             //setting req.session.userId
    //             req.session.userId = result.rows[0].id;
    //             console.log(
    //                 "req.session.userId in regsitrations",
    //                 req.session.userId
    //             );
    //
    //             // ses.sendEmail(to, subject, message)
    //             return res.json(result);
    //         })
    //         .catch(function(err) {
    //             console.log("err in registration/submit", err);
    //             return res.json({ error: true });
    //         });
});
