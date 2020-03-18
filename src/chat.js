import React, { useEffect, useRef } from "./react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector(state => state && state.msgs);
    console.log("here are my last tenChatMessages: ", chatMessages);

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
        <div className="chat">
            <h1> Chat Room </h1>
            <div className="chat-container" ref={elementRef}>
                <p> your chat message chere make it dynamic.. </p>
            </div>
            <textarea
                placeholder="Add your Mesage here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}

// //CSS styling
// chat container {
//     height: 300 px;
//     overflow-y: scroll;
// }
