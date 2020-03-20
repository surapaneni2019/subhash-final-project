import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import "moment-timezone";

export default function Chat() {
    const chatMessages = useSelector(state => state && state.msgs);
    console.log("here are my lastTenChatMessages: ", chatMessages);

    const elementRef = useRef();

    useEffect(() => {
        console.log("chat component mounted!");
        // console.log("elementRef: ", elementRef.current);
        // console.log("scroll top", elementRef.current.scrollTop);
        // console.log("scroll height", elementRef.current.scrollHeight);
        // console.log("client height", elementRef.current.clientHeight);
        elementRef.current.scrollTop =
            elementRef.current.scrollHeight - elementRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = e => {
        console.log("e.key: ", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("e.target.value: ", e.target.value);
            socket.emit("newMessages", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <div className="chat-container">
            <span className="chat-title"> Chat </span>
            <div className="chat" ref={elementRef}>
                {chatMessages &&
                    chatMessages.map(msg => (
                        <div className="message" key={msg.id}>
                            <div className="image-info-msg">
                                <a href={`./user/${msg.user_id}`}>
                                    <img
                                        className="chat-img"
                                        src={msg.url || "/defaultimage.jpg"}
                                        alt={(msg.first, msg.last)}
                                    />
                                </a>
                                &nbsp;{msg.first} {msg.last}
                                &nbsp;---&nbsp;
                                <span className="chat-date">
                                    <Moment fromNow>{msg.created_at}</Moment>
                                </span>
                            </div>

                            <br />
                            {msg.message}
                        </div>
                    ))}

                <textarea
                    rows="4"
                    cols="50"
                    placeholder="Drop your message here"
                    onKeyDown={keyCheck}
                    className="chat-textarea"
                ></textarea>
            </div>
        </div>
    );
}

// //CSS styling
// chat container {
//     height: 300 px;
//     overflow-y: scroll;
// }
