import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitClick = this.submitClick.bind(this);
    }

    //handleChange: we store user info in state
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this.state", this.state)
        );
    }

    //submit login info by clicking on submit button
    submitClick(e) {
        console.log("submitClick is running!!");
        e.preventDefault();

        const { email, password } = this.state;
        console.log("this.state", this.state);

        axios
            .post("/login/submit", { email, password })
            .then(function({ data }) {
                console.log("data in login/submit", data);

                location.replace("/");
            })
            .catch(function(error) {
                console.log(
                    "error in submit click for regsitration info",
                    error
                );

                this.setState({ error: true });
                console.log("this.setState in catch", this.setState);
            });
    }

    render() {
        return (
            <div>
                <h1> Login </h1>
                <form>
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

                    <button onClick={this.submitClick}> submit </button>
                </form>

                {this.state.error && (
                    <span className="error">
                        Ahh Uhh!something gone wrong! Please be sure you entered
                        the right password and email
                    </span>
                )}
            </div>
        );
    }
}
