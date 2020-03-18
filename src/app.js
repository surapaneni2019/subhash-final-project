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
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./FindPeople";
import Friends from "./friends.js";
import chat from "./chat.js";
import { BrowserRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false,
            first: null,
            last: null,
            url: null,
            image: null,
            id: null,
            bio: null,
            setbio: null
            // its better to keep it shallow(leave empty this object..to not
            // make it complicated to look it in a big data...)its optional can leave this.state empty as well
        };
        this.toggleModal = this.toggleModal.bind(this);
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
                console.log("error in componentDidMount App", error);
            });
    }
    //to check if the ajax request is complete or not..
    render() {
        if (!this.state.id) {
            return null; //if ajax request not completes it returns null..
        }
        return (
            <div>
                <div className="header">
                    <img />
                    <img className="logo" src="/helpmelogo.jpg" alt="logo" />
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        url={this.state.url}
                        toggleModal={e => this.toggleModal(e)}
                    />
                </div>

                <BrowserRouter>
                    <div className="links-header">
                        <Link className="find-friends" to="/friends">
                            friends
                        </Link>

                        <Link className="find-friends" to="/recentusers">
                            find people
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
            </div>
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
