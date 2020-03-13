//src/registration.js

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

// creating the class component so as to interact with the user...
export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitClick = this.submitClick.bind(this);
    }
    //component on React.component should have always C as capital letter..
    //we store userinfo in state which is in general called as a data
    handleChange(e) {
        // console.log("e.target.value" e.target.value);
        //letting us to retrieve/know what the user is typing
        this.setState(
            {
                [e.target.name]: e.target.value //[ ] is not an array in this case..
                // last: e.target.value,
                // email: e.target.value,
                // password: e.target.value doesnt work this approach..
            },
            () => console.log("this.state: ", this.state)
        );
        // console.log(this.state);
        //we got all the information and saved to the State..
    }
    //we submit the resistration inf. when user clicks the submit button..
    submitClick(e) {
        console.log("submitClick is running!!");
        e.preventDefault();
        var that = this;

        axios
            .post("/registration/submit", that.state)
            .then(function({ data }) {
                console.log("data in get/ user: ", data);
                location.replace("/");
            })
            .catch(function(error) {
                console.log(
                    "error in submit click the registration form Info: ",
                    error
                );
                that.setState({ error: true });
            });
    }

    render() {
        return (
            <div>
                <h1> Register </h1>

                {this.state.error && (
                    <span className="error">Ah Uh! something gone wrong!!</span>
                )}

                <form>
                    <input
                        onChange={this.handleChange}
                        name="first"
                        type="text"
                        placeholder="first name"
                        autoComplete="off"
                    />
                    <input
                        onChange={this.handleChange}
                        name="last"
                        type="text"
                        placeholder="last name"
                        autoComplete="off"
                    />
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                        autoComplete="off"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                        autoComplete="off"
                    />
                    <button onClick={this.submitClick}> Submit </button>
                </form>
                <Link to="/login">Login</Link>
            </div>
        );
    }
}
