import React from "react";
import Registration from "./registration";
import Login from "./login";
import axios from "./axios";
import { Link } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";

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
            [e.target.name]: e.target.value
        }),
            () => console.log("this.state", this.state);
    }

    submitClick(e) {
        e.preventDefault();

        if (this.state.currentDisplay == 1) {
            const { email } = this.state;
            console.log("this.state: ", this.state);

            var me = this;

            axios
                .post("/password/reset/start", me.state)
                .then(function({ data }) {
                    console.log("this.state in password/restart", me.state);
                    me.setState({ currentDisplay: 2 });
                })
                .catch(function(error) {
                    console.log(
                        "error in submit click for regsitration info",
                        error
                    );

                    this.setState({ error: true });
                });
        } else if (this.state.currentDisplay == 2) {
            const { code, password } = this.state;

            var me = this;
            axios
                .post("/password/reset/verify", me.state)
                .then(function({ data }) {
                    console.log("this.state in password/restart", me.state);
                    me.setState({ currentDisplay: 3 });
                })
                .catch(function(error) {
                    console.log(
                        "error in submit click for regsitration info",
                        error
                    );

                    this.setState({ error: true });
                });
        }
    }
    render() {
        const { currentDisplay } = this.state;
        // let elem;
        // if(currentDisplay == 1) {
        //     let elem = (
        //         <div>
        //         <inout/>
        //         </div>
        //     );
        // }else
        return (
            <div>
                {currentDisplay == 1 && (
                    <div>
                        <form>
                            <label htmlFor="email">
                                Please Enter the E-mail with the one you
                                registered with
                            </label>
                            <input
                                onChange={this.handleChange}
                                name="email"
                                type="text"
                                placeholder="email"
                                autoComplete="off"
                            />
                            <button onClick={this.submitClick}> Submit </button>
                            {this.state.error && (
                                <span className="error">
                                    Ahh Uhh!, Checkitout something gone wrong!
                                </span>
                            )}
                        </form>
                    </div>
                )}
                {currentDisplay == 2 && (
                    <div>
                        <form>
                            <label htmlFor="code"> Code </label>
                            <input
                                onChange={this.handleChange}
                                name="code"
                                type="text"
                                placeholder="code"
                                autoComplete="off"
                            />

                            <label htmlFor="password"> Password </label>
                            <input
                                onChange={this.handleChange}
                                name="password"
                                type="password"
                                placeholder="password"
                                autoComplete="off"
                            />
                            <button onClick={this.submitClick}> Submit </button>
                            {this.state.error && (
                                <span className="error">
                                    Ahh Uhh! Check it out, Something gone wrong!
                                </span>
                            )}
                        </form>
                    </div>
                )}
                {currentDisplay == 3 && (
                    <div>
                        <h1> yesssssssssssss! </h1>
                    </div>
                )}
            </div>
        );
    }
}

//a && b works if one in the left is truthy it picks up one in the right
//if the one in the left is falsy it picksup the one in the left one in the syntax
