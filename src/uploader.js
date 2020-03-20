import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            uploaderVisible: false,
            error: false,
            success: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.setState({ uploaderVisible: false });
    }

    componentDidMount() {
        this.setState({ uploaderVisible: true }, () => {
            console.log("this.state", this.state);
        });
    }

    //handleChange for file upload
    handleChange(event) {
        this.setState({
            uploaderVisible: true
        });

        console.log("this.state", this.state);
        console.log(event.target.files[0]);

        const formData = new FormData();

        this.setState({ file: event.target.files[0] }, () => {
            console.log("this.state.file", this.state.file);
            console.log("this.state", this.state);
            formData.append("file", this.state.file);
        });

        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("data in uploading file", data);
                console.log("this", this);

                this.props.finishedUploading(data);
                this.setState({ uploaderVisible: false });
            })
            .catch(function(error) {
                console.log("error in submitting file", error);
                this.props({ error: true });
            });
    }

    render() {
        return (
            <div>
                {this.state.uploaderVisible === true && (
                    <div className="uploader-modal">
                        <div className="close-info" onClick={this.closeModal}>
                            X
                        </div>
                        <span className="uploader">
                            please upload your profile picture
                        </span>
                        <form>
                            <label
                                htmlFor="file-upload"
                                className="custom-file-upload"
                            >
                                Upload Image
                                <img
                                    className="logo-upload"
                                    src="download-file.svg"
                                    alt="download"
                                />
                            </label>
                            <input
                                onChange={this.handleChange}
                                id="file-upload"
                                className="file"
                                type="file"
                                name="file"
                                accept="image/*"
                            />
                        </form>
                        {this.state.error && (
                            <span className="error">
                                please make sure you picked the image format
                                file
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
