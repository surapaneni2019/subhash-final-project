import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton.js";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get(`/user/${this.props.match.params.id}.json`)
            .then(({ data }) => {
                if (data.redirectTo == "/") {
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                }
            });
    }
    render() {
        return (
            <div className="other-profiles">
                <FriendButton
                    otherUserId={this.props.match.params.id}
                    userId={this.props.id}
                />
                <div className="profile">
                    {this.state.first} {this.state.last}
                    <span className="bio">{this.state.bio}</span>
                    <img
                        className="profilepic"
                        src={this.state.url || "/defaultimage.jpg"}
                        alt={`${this.state.first} ${this.state.last}`}
                    />
                </div>
            </div>
        );
    }
}
//Dont write any component in the id to figure out whether there an id exists or not..
//this below command is to redirect: if the logged in url is the id ofthe url
//this.props.history.push('/');
//app.get('/user/:id.json') set here the rendering the url to the slash...
//to generate teh fake 200 users is spiced.space/allspice/soical-network/file_users...
