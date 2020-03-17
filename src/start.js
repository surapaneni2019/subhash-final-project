import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
//if you use the default in the export no need of curly paranthesis enclosed for
//the Welcome function...
import App from "./app";
// import axios from "./axios";
import { init } from "./socket";

////////REDUX BOILER PLATE///////////////////////////////////
import { Provider } from "react-redux";
//provide our App component with redux..
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
import reducer from "./reducer.js";
////////////////////BOILER PLATE ENDS///////////////////////////////

//we need to create a reducer now...

let component;

//the component or the element variable here it is component variable is the
//one responsible for figuring out which component will be rendered
//now we generate the component named as welcome to enable our registration

if (location.pathname === "/welcome") {
    //render the registration page
    component = <Welcome />;
} else {
    init(store);
    //render the logo
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
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
