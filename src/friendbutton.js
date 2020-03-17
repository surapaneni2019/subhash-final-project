import React, { useEffect, useState } from "react";
import axios from "./axios";

//useEffect hook makes ajax request to figure out the initial status of the friendship
//it will set in buttonText what the button should say

export default function FriendButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState("Make Friend Request");
    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/friends/${otherUserId}`);

            console.log("result in FriendButton: ", data);
            console.log("data.receiver_id: ", data.data.receiver_id);
            console.log("data[0]sender_id: ", data.data.sender_id);
            console.log("data: ", data);

            if (data === undefined) {
                setButtonText("Make Friend Request");
            } else if (
                data.data.accepted === true &&
                data.data.receiver_id == otherUserId
            ) {
                setButtonText("End Friendship");
            } else if (
                data.data.receiver_id == otherUserId &&
                data.data.accepted === false
            ) {
                setButtonText("cancel friend request");
            } else if (data.data.sender_id == otherUserId) {
                setButtonText("Accept Friend Request");
            }
        })();
    }, []);

    const handleClick = e => {
        //click on friendship button
        console.log("otherUserId: ", otherUserId);
        e.preventDefault();

        if (buttonText === "Make Friend Request") {
            axios
                .post(`/make-friend-request/${otherUserId}`)
                .then(function({ data }) {
                    console.log(
                        "data in click friendship if button is Make Friend Request: ",
                        data
                    );
                    setButtonText("cancel friend request");
                })
                .catch(function(error) {
                    console.log("error in click friendship: ", error);
                });
        } else if (buttonText === "Accept Friend Request") {
            axios
                .post(`/accept-friend-request/${otherUserId}`)
                .then(function({ data }) {
                    console.log(
                        "data in click friendship:if button text is accept friend request: ",
                        data
                    );
                    setButtonText("End Friendship");
                })
                .catch(function(error) {
                    console.log(
                        "error in click friendship: if button text is accept friend request: ",
                        error
                    );
                });
        } else if (
            buttonText === "End Friendship" ||
            buttonText === "cancel friend request"
        ) {
            axios
                .post(`/end-friendship/${otherUserId}`)
                .then(function({ data }) {
                    console.log(
                        "data in click friendship:  if button is end friendship: ",
                        data
                    );
                    setButtonText("Make Friend Request");
                })
                .catch(function(error) {
                    console.log(
                        "error in click friendship: if button is end friendship: ",
                        error
                    );
                });
        }
    };

    return (
        <div>
            <button className="friend-button" onClick={handleClick}>
                {buttonText}
            </button>
        </div>
    );
}
