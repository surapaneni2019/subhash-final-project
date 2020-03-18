import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false,
            bio: this.props.bio,
            setBio: this.props.setBio
        };

        this.onClick = this.onClick.bind(this);
        this.submitClick = this.submitClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //show textarea to add or edit bio on click
    onClick() {
        this.setState({ bioEditorIsVisible: true }, () => {
            console.log("this.state", this.state);
        });
    }

    //textarea value
    handleChange(e) {
        this.setState({ bio: e.target.value }, () => {
            console.log("this.state handleChange BioEditor: ", this.state);
        });
    }

    //submit bio
    submitClick(e) {
        e.preventDefault();

        console.log("this.state.bio: ", this.state.bio);

        axios
            .post("/uploadbio", this.state)
            .then(({ data }) => {
                console.log("this: ", this);
                console.log("data: ", data);
                this.props.setBio(data);

                this.setState({ bioEditorIsVisible: false });
            })
            .catch(function(error) {
                console.log("error in axios submitting bio: ", error);
                this.props({ error: true });
            });
    }

    render() {
        return (
            <div className="bio-editing-section">
                {!this.state.bio && (
                    <div>
                        <button className="addbio" onClick={this.onClick}>
                            Add your Bio
                        </button>
                    </div>
                )}

                {this.state.bio && (
                    <div>
                        <button className="addbio" onClick={this.onClick}>
                            Edit your Bio
                        </button>
                    </div>
                )}

                {this.state.bioEditorIsVisible && (
                    <div>
                        <div className="bioeditor">
                            <form
                                className="bioeditor-form"
                                action="/uploadbio"
                                method="post"
                                id="form_bio"
                            >
                                <label htmlFor="bio">
                                    Add or Edit your Bio
                                </label>
                                <textarea
                                    className="bioeditor-textarea"
                                    name="bio"
                                    form="form_bio"
                                    rows="6"
                                    cols="50"
                                    onChange={this.handleChange}
                                    value={this.state.bio}
                                ></textarea>
                                <button onClick={this.submitClick}>SAVE</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
