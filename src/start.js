import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
//if you use the default in the export no need of curly paranthesis enclosed for
//the Welcome function...
// import App from "./app";
// import axios from "./axios";

let component;

//the component or the element variable here it is component variable is the
//one responsible for figuring out which component will be rendered
//now we generate the component named as welcome to enable our registration

if (location.pathname === "/welcome") {
    //render the registration page
    component = <Welcome />;
} else {
    //render the logo
    component = <p>logo</p>;
}

// ReactDOM.render(
//     location.pathname == "/welcome" ? <Welcome /> : <App />,
//     document.querySelector("main")
// );

//This is the wrapper like and the main Component and the other components
//nested within it...
ReactDOM.render(component, document.querySelector("main"));

//we only render ReactDOM only once in our application which is in general in
//React and we can have many components(children) within a component(parent)
//but the component(parent) is the only one which is coded in the above cmdline

//
//if the user successfully registers use this command to redirect user to '/'
//location.replace('/')
// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
