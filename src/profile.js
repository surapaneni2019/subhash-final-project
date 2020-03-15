import React from "react";
import ProfilePic from "./profilepic.js";
import BioEditor from "./bioeditor.js";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            first: this.props.first,
            last: this.props.last,
            image: this.props.image,
            bio: this.props.bio,
            setBio: this.props.setBio,
            uploaderVisible: this.props.uploaderVisible
        };
    }

    render() {
        return (
            <div id="profile-container">
                <div className="profile">
                    {this.props.first} {this.props.last}
                    <span className="bio">{this.state.bio}</span>
                </div>
                <ProfilePic
                    first={this.props.first}
                    last={this.props.last}
                    url={this.props.url}
                    onClick={this.openUploader}
                />
                <BioEditor
                    bio={this.props.bio}
                    bioEditorIsVisible={this.bioEditorIsVisible}
                    setBio={newBio =>
                        this.setState({
                            bio: newBio
                        })
                    }
                />
            </div>
        );
    }
}
