//src/welcome.js
//this is a component called as welcome
//we usually import React from "react" anytime we create a component

import React from "react";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";
import { Link } from "react-router-dom";

// import axios from "./axios";
import { HashRouter, Route } from "react-router-dom";

//axios.js is run from the above cmd line so that the copy of axios run everytime for the
//cookie session
//welcome is responsible for rendering the resgistration and the login pages

export default function Welcome() {
    return (
        <div id="welcome">
            <h1> Welcome to my social network </h1>
            <img src="helpmelogo.jpg" alt="logo" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/reset" component={ResetPassword} />
                    <Link to="/login"> Login </Link>
                    <Link to="/reset"> Reset your Password </Link>
                    <b></b>
                    <a href="/logout">logout</a>
                </div>
            </HashRouter>
        </div>
    );
}

//you can keep img elemnt for welcome banner
//<img src='big_logo_png' alt='logo'/>
//we tell for the route what component it renders it by rferencing in the props.
//it will register only when there is a slash in the Url...when we mention it
//in the Route component. It renders the login page if there is /login in then
//route....exact before component makes sure(doubleconfirmation) that the registration only happens
//when the user reaally registers rather thatn just by mistaken typing slash..
//import { Link } from 'react-router-dom';
//<Link to="/Login"> Log in </Link> this cmd line goes into the below exportcmd
// export default class Register {
//     render() {
//         return (
//             <div>
//             <Link to='login'>Log in </Link>
//             </div>
//         )
//     }
// }
//<a href="#login"> login  </a>
//<a href ="/logout">logout </a>
//all the route ocmponents must have the HashRouter as an ancestor...
