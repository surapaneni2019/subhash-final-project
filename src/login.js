import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

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
        this.setState({
            [e.target.name]: e.target.value,
            error: false
        }),
            () => console.log("this.state", this.state);
    }

    //submit login info by clicking on submit button
    submitClick(e) {
        console.log("submitClick is running!!");
        e.preventDefault();

        const { email, password } = this.state;
        console.log("this.state", this.state);

        //triggering sprecific error based on the input
        if (!this.state.email || this.state.email.length < 3) {
            this.setState({ error: true });
            return;
        } else if (!this.state.password || this.state.password.length < 5) {
            this.setState({ error: true });
            return;
        }
        var me = this;

        axios
            .post("/login/submit", { email, password })
            .then(function({ data }) {
                console.log("data in login/submit", data);
                if (data.error) {
                    me.setState({ error: true });
                }

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
            <div className="login">
                <h1 className="welcome"> Login </h1>
                <form>
                    <label htmlFor="code"> eMail </label>
                    <input
                        className="auth-input"
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                        autoComplete="off"
                    />
                    <label htmlFor="code"> Password </label>
                    <input
                        className="auth-input"
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                        autoComplete="off"
                    />

                    <button className="auth" onClick={this.submitClick}>
                        Submit
                    </button>
                </form>
                <Link className="link-auth" to="/reset">
                    Reset your Password
                </Link>

                {this.state.error && (
                    <span className="error-login">
                        Error in Authentification <br /> Please enter your right
                        email and Password <br />
                    </span>
                )}
            </div>
        );
    }
}
