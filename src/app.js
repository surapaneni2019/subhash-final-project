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

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // image: '/default.gif'
            // uploaderVisible: false //its optional can leave this.state empty as well
            //its better to keep it shallow(leave empty this object..to not
            // make it complicated to look it in a big data...)
        };
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState(data);
        });
    }
    render() {
        if (!this.state.id) {
            return <img src="/progressbar.gif" alt="loading.." />; //if ajax request not completes it returns null..
        }
        return (
            <>
                <img src="/logo.gif" alt="logo" />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.image}
                    clickHandler={() =>
                        this.setState({
                            uploaderVisible: true
                        })
                    }
                />
                {this.state.uploaderVisible && (
                    <Uploader
                        finishedUploading={newUrl =>
                            this.setState({
                                image: newUrl
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
