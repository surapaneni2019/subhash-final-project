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
import Profile from "./profile";
import OtherProfile from "./Otherprofile";
import Users from "./FindPeople";
import { BrowserRouter, Route } from "react-router-dom";

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
        this.openUploader = this.openUploader.bind(this);
    }

    openUploader() {
        console.log("click: open uploader");
        this.setState({ uploaderVisible: true });
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data: ", data);
                this.setState(data);
            })
            .catch(function(error) {
                console.log("error in componentDidMount App", error);
            });
    }
    //to check if the ajax request is complete or not..
    render() {
        if (!this.state.id) {
            return <img src="/progressbar.gif" alt="loading.." />; //if ajax request not completes it returns null..
        }
        return (
            <BrowserRouter>
                <div>
                    <div id="head-container">
                        <img src="/helpmelogo.jpg" alt="logo" />
                        <img className="profilepic" src={this.state.image} />
                    </div>
                    <div id="profile">
                        <Profile
                            first={this.state.first}
                            last={this.state.last}
                            url={this.state.image}
                            bio={this.state.bio}
                            setbio={newBio =>
                                this.setState({
                                    bio: newBio
                                })
                            }
                            onClick={this.openUploader}
                        />
                    </div>
                    <Route
                        path="/user/:id"
                        render={props => (
                            <OtherProfile
                                key={props.match.imageUrl}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />

                    {this.state.uploaderVisible && (
                        <Uploader
                            finishedUploading={newUrl =>
                                this.setState({
                                    image: newUrl,
                                    uploaderVisible: false
                                })
                            }
                        />
                    )}
                    <Route path="/users" component={Users} />
                </div>
            </BrowserRouter>
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
