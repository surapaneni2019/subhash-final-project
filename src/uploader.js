import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("this.props: ", this.props);
        this.handleChange = this.handleChange.bind(this);
        this.upload = this.upload.bind(this);
    }

    handleChange(e) {
        console.log("e.target.files[0]", e.target.files[0]);
        this.setState(
            {
                [e.target.name]: e.target.files[0]
            },
            () => console.log("this.state: ", this.state)
        );
    }

    upload() {
        let formData = new FormData();
        // console.log('this.state: ', this.state);
        formData.append("file", this.state.file);

        axios.post("upload", formData).then(({ data }) => {
            console.log("data axios upload: ", data);
            console.log("this.props: ", this.props);
            this.props.finishedUploading(data);
        });
    }

    render() {
        return (
            <div>
                <h1> Please Upload your Profile Picture </h1>
                <form>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Uploaf picture
                        <img
                            className="logo-upload"
                            src="download-file.svg"
                            alt="download"
                        />
                    </label>
                    <input
                        type="file"
                        name="file"
                        className="file"
                        onChange={this.handleChange}
                        accept="image/*"
                        id="file-upload"
                    />
                    <button onClick={this.upload}>Upload</button>
                </form>
            </div>
        );
    }
}
