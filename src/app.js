import React from "react";
//the components which require a state(when you wann change anything) does
// need a class...
//There are cases if you dont have states you still need class because of
//the concept of like lifeCycleMethods(automatically called on components)
//equivalent to mounted in Vue is the ComponentDidMOunt method..(to make a
//ajax request and let it showup that content..)
//App encloses all the other future required components and we need a route for
//the App...
import axios from "./axios";
//import for the browser router purpose...a new import file..in part 6
import Uploader from "./uploader.js";
import Login from "./login.js";
import ProfilePic from "./profilepic.js";
import Profile from "./profile.js";
// import Exchange from "./exchange.js";
import OtherProfile from "./otherprofile.js";
import FindPeople from "./findpeople.js";
import Friends from "./friends.js";
import Chat from "./chat.js";
import { BrowserRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false,
            first: null,
            last: null,
            url: null,
            id: null,
            bio: null,
            setbio: null,
            deleteAccountCheckVisible: false
            // its better to keep it shallow(leave empty this object..to not
            // make it complicated to look it in a big data...)its optional can leave this.state empty as well
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.deleteaccountcheck = this.deleteaccountcheck.bind(this);
        this.closedeleteAccountCheck = this.closedeleteAccountCheck.bind(this);
    }

    toggleModal() {
        if (!this.state.uploaderVisible) {
            this.setState({ uploaderVisible: true });
        } else {
            this.setState({ uploaderVisible: false });
        }
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data in /user: ", data);
                this.setState(data);
            })
            .catch(function(error) {
                console.log("error in componentDidMount App: ", error);
            });
    }
    logout() {
        axios
            .get("/logout")
            .then(({ data }) => {
                location.replace("/welcome");
            })
            .catch(function(error) {
                console.log("error in /logout: ", error);
            });
    }
    deleteaccountcheck() {
        this.setState({ deleteAccountCheckVisible: true });
    }

    closedeleteAccountCheck() {
        this.setState({ deleteAccountCheckVisible: false });
    }

    deleteaccount() {
        axios
            .get("/deleteaccount")
            .then(({ data }) => {
                location.replace("/welcome");
            })
            .catch(function(error) {
                console.log("error in /deleteaccount: ", error);
            });
    }

    //to check if the ajax request is complete or not..
    render() {
        if (!this.state.id) {
            return null; //if ajax request not completes it returns null..
        }
        return (
            <>
                <div className="header">
                    <img className="logo" src="/helpmelogo.jpg" alt="logo" />
                </div>
                <BrowserRouter>
                    <div className="profile-section">
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            url={this.state.url}
                            toggleModal={e => this.toggleModal(e)}
                        />
                        <Link className="profile-section-link" to="/">
                            Edit Bio
                        </Link>
                        <span
                            className="profile-section-link"
                            onClick={this.deleteaccountcheck}
                        >
                            Delete Account
                        </span>

                        <span
                            className="profile-section-link"
                            onClick={this.logout}
                        >
                            Logout
                        </span>
                    </div>

                    {this.state.deleteAccountCheckVisible && (
                        <div className="deleteaccount-confirm">
                            <div
                                className="close-info"
                                onClick={this.closedeleteAccountCheck}
                            >
                                X
                            </div>
                            <span className="deleteaccount">
                                Are you sure you wanna delete your account? All
                                your data and activity will be deleted.
                            </span>
                            <br />
                            <span
                                className="deleteaccount-decision"
                                onClick={this.deleteaccount}
                            >
                                Yup! Delete my Account
                            </span>
                            <span
                                className="deleteaccount-decision"
                                onClick={this.closedeleteAccountCheck}
                            >
                                Cancel
                            </span>
                        </div>
                    )}

                    <div className="links-header">
                        <Link className="find-friends" to="/chat">
                            Chat
                        </Link>

                        {/* <Link className="find-friends" to="/exchange">
                            Exchange
                        </Link> */}

                        <Link className="find-friends" to="/friends">
                            Friends
                        </Link>

                        <Link className="find-friends" to="/recentusers">
                            Find People
                        </Link>
                    </div>

                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    url={this.state.url}
                                    bio={this.state.bio}
                                    setbio={newBio =>
                                        this.setState({
                                            bio: newBio
                                        })
                                    }
                                    toggleModal={e => this.toggleModal(e)}
                                />
                            )}
                        />

                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />

                        <Route
                            path="/recentusers"
                            render={props => (
                                <FindPeople
                                    key={props.match.id}
                                    match={props.match}
                                    history={props.history}
                                    id={this.state.id}
                                />
                            )}
                        />

                        <Route
                            path="/friends"
                            render={props => (
                                <Friends
                                    key={props.match.id}
                                    match={props.match}
                                    history={props.history}
                                    id={this.state.id}
                                />
                            )}
                        />

                        {/*
                            <Route
                            path="/exchange"
                            render={props => <Exchange key={props.match.id} />}
                            />
                            */}

                        <Route
                            path="/chat"
                            render={props => <Chat key={props.match.id} />}
                        />
                    </div>
                </BrowserRouter>

                {this.state.uploaderVisible && (
                    <Uploader
                        finishedUploading={newUrl =>
                            this.setState({
                                url: newUrl
                            })
                        }
                    />
                )}
            </>
        );
    }
}

//in the server if we have res.json an obejct which looks like as...
//res.json({
// id:1,
// first: xx, rows[0].first
// last: yy,
// image: 'url'rows[0].image || undefined or '/default.png'
// })
//React only has rights to change from Parent to child but not the other way around...
