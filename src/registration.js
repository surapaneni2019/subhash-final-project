//src/registration.js

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

// creating the class component so as to interact with the user...
export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            error_emptyfields: false,
            error_last: false,
            error_email: false,
            error_password: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitClick = this.submitClick.bind(this);
    }
    //component on React.component should have always C as capital letter..
    //we store userinfo in state which is in general called as a data
    handleChange(e) {
        // console.log("e.target.value" e.target.value);
        //letting us to retrieve/know what the user is typing
        this.setState({
            [e.target.name]: e.target.value, //[ ] is not an array in this case..
            error_first: false,
            error_last: false,
            error_email: false,
            error_password: false

            // last: e.target.value,
            // email: e.target.value,
            // password: e.target.value doesnt work this approach..
        }),
            () => console.log("this.state: ", this.state);
    }
    // console.log(this.state);
    //we got all the information and saved to the State..

    //we submit the resistration inf. when user clicks the submit button..

    submitClick(e) {
        e.preventDefault();

        const { first, last, email, password } = this.state;

        //triggering specific error based on the input
        if (!this.state.first || this.state.first.length < 2) {
            this.setState({ error_first: true });
            return;
        } else if (!this.state.last || this.state.last.length < 2) {
            this.setState({ error_last: true });
            return;
        } else if (
            !this.state.email ||
            !this.state.email.includes("@") ||
            this.state.email.length < 3
        ) {
            this.setState({ error_email: true });
            return;
        } else if (!this.state.password || this.state.password.length < 5) {
            this.setState({ error_password: true });
            return;
        }
        axios
            .post("/registration/submit", this.state)
            .then(function({ data }) {
                console.log("data in get/ user: ", data);
                location.replace("/");
            })
            .catch(function(error) {
                console.log(
                    "error in submit click in the registration form Info: ",
                    error
                );
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div className="register">
                <h1 className="Welcome"> Register </h1>
                <form>
                    <label className="auth" htmlFor="code">
                        first name
                    </label>
                    <input
                        className="auth-input"
                        onChange={this.handleChange}
                        name="first"
                        type="text"
                        placeholder="first name"
                        autoComplete="off"
                    />
                    <label className="auth" htmlFor="code">
                        last name
                    </label>
                    <input
                        className="auth-input"
                        onChange={this.handleChange}
                        name="last"
                        type="text"
                        placeholder="last name"
                        autoComplete="off"
                    />
                    <label className="auth" htmlFor="code">
                        email
                    </label>
                    <input
                        className="auth-input"
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                        autoComplete="off"
                    />
                    <label className="auth" htmlFor="code">
                        Password
                    </label>
                    <input
                        className="auth-input"
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                        autoComplete="off"
                    />

                    <button className="auth-button" onClick={this.submitClick}>
                        Submit
                    </button>
                </form>

                {/*
                <Link className="link-auth" to="/login">
                    // Already registered! Then Login here //{" "}
                </Link> */}

                {this.state.error && (
                    <span className="error-register">
                        Ah Uh! something gone wrong!!
                    </span>
                )}
                {this.state.error_first && (
                    <span className="error-register">
                        please enter your first name correctly
                    </span>
                )}
                {this.state.error_last && (
                    <span className="error-register">
                        please enter your last name correctly
                    </span>
                )}
                {this.state.error_email && (
                    <span className="error-register">
                        please enter your valid email
                    </span>
                )}
                {this.state.error_password && (
                    <span className="error-register">
                        please enter your password not less than three
                        characters
                    </span>
                )}
            </div>
        );
    }
}
