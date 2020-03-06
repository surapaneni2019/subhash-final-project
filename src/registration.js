//src/registration.js

import React from "react";
import axios from "./axios";

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
        e.preventDefault();
        const { first, last, email, password } = this.state;
        console.log("this.state: ", this.state);

        if (!this.state.first || this.state.first.length < 2) {
            this.setState({ error_first: true });
            return;
        } else if (!this.state.last || this.state.last.length < 2) {
            this.setState({ error_last: true });
            return;
        } else if (!this.state.email || this.state.email.length < 3) {
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
                    "error in submit click the registration form Info: ",
                    error
                );
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div>
                <h1> Register </h1>
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
                {this.state.error && (
                    <p className="error">Ah Uh! something gone wrong!!</p>
                )}

                {this.state.error_first && (
                    <p className="error">
                        Ah Uh! something gone wrong! Please be sure to fill out
                        your first name
                    </p>
                )}
                {this.state.error_last && (
                    <p className="error">
                        Ah Uh! something gone wrong! Please be sure to fill out
                        your last name
                    </p>
                )}
                {this.state.error_email && (
                    <p className="error">
                        Ah Uh! something gone wrong!Please be sure to fill out
                        your emailaddress
                    </p>
                )}
                {this.state.error_password && (
                    <p className="error">
                        Ah Uh! something gone wrong!Please be sure your password
                        consists atleast 5 characters
                    </p>
                )}
            </div>
        );
    }
}
