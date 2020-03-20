import React from "react";
import ProfilePic from "./profilepic.js";
import BioEditor from "./bioeditor.js";
import App from "./app";
import Exchange from "./exchange.js";

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
        console.log("this.props - profile", this.props);
        return (
            <>
                <div className="profile-wrapper">
                    <div className="profile">
                        {this.props.first} {this.props.last}
                        <span className="bio">{this.state.bio}</span>
                        <ProfilePic
                            first={this.props.first}
                            last={this.props.last}
                            url={this.props.url}
                            toggleModal={this.props.toggleModal}
                        />
                    </div>
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
            </>
        );
    }
}
