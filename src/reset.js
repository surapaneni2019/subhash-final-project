import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDisplay: 1,
            reset: false,
            error: false,
            verified: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitClick = this.submitClick.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            error: false
        }),
            () => console.log("this.state", this.state);
    }

    submitClick(e) {
        e.preventDefault();

        if (this.state.currentDisplay == 1) {
            const { email } = this.state;
            // console.log("this.state: ", this.state);
            if (
                !this.state.email ||
                this.state.email.length < 3 ||
                !this.state.email.includes("@")
            ) {
                this.setState({ error: true });
                return;
            }

            var me = this;

            axios
                .post("/password/reset/start", me.state)
                .then(function({ data }) {
                    // console.log("this.state in password/restart", me.state);
                    if (data.error) {
                        me.setState({ error: true });
                    } else {
                        me.setState({ currentDisplay: 2 });
                    }
                })
                .catch(function(error) {
                    console.log(
                        "error in the submit click for Registration Info: ",
                        error
                    );

                    this.setState({ error: true });
                });
        } else if (this.state.currentDisplay == 2) {
            const { code, password } = this.state;
            if (!this.state.code || !this.state.password) {
                this.setState({ error: true });
                return;
            }

            axios
                .post("/password/reset/verify", me.state)
                .then(function({ data }) {
                    // console.log("this.state in password/restart", me.state);
                    me.setState({ currentDisplay: 3 });
                })
                .catch(function(error) {
                    console.log(
                        "error in submit click for Registration Info: ",
                        error
                    );

                    me.setState({ error: true });
                });
        }
    }
    render() {
        return (
            <div className="reset">
                {this.state.currentDisplay == 1 && (
                    <div className="reset-part1">
                        <h1 className="welcome"> Reset Password </h1>
                        <form>
                            <label htmlFor="email">
                                Please Enter your registered E-mail
                            </label>
                            <input
                                onChange={this.handleChange}
                                name="email"
                                type="text"
                                placeholder="email"
                                autoComplete="off"
                            />
                            <button
                                className="reset"
                                onClick={this.submitClick}
                            >
                                Submit
                            </button>
                            {this.state.error && (
                                <span className="error-reset">
                                    Ahh Uhh!, Check out your email entered
                                    something was wrong!
                                </span>
                            )}
                        </form>
                    </div>
                )}
                {this.state.currentDisplay == 2 && (
                    <div className="reset-part2">
                        <form>
                            <label className="reset" htmlFor="code">
                                Code
                            </label>
                            <input
                                onChange={this.handleChange}
                                name="code"
                                type="text"
                                placeholder="code"
                                autoComplete="off"
                            />

                            <label className="reset" htmlFor="password">
                                New Password
                            </label>
                            <input
                                onChange={this.handleChange}
                                name="password"
                                type="password"
                                placeholder="password"
                                autoComplete="off"
                            />
                            <button
                                className="reset-button"
                                onClick={this.submitClick}
                            >
                                Submit
                            </button>
                            {this.state.error && (
                                <span className="error">
                                    Ahh Uhh! Recheck your entered Code sent to
                                    your email, Code Doesnt match!
                                </span>
                            )}
                        </form>
                    </div>
                )}
                {this.state.currentDisplay == 3 && (
                    <div className="password-reset">
                        <span>
                            yesssssssssssss! you have changed your password
                        </span>

                        <Link className="link-auth" to="/login">
                            Login here
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}

//a && b works if one in the left is truthy it picks up one in the right
//if the one in the left is falsy it picksup the one in the left one in the syntax
