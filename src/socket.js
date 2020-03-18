import * as io from "socket.io-client";

import { chatMessages, newMessage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        //
        socket.on("newMessages", msg => store.dispatch(newMessage(msg)));

        // socket.on("muffinMagic: ", myMuffin => {
        //     console.log("myMuffin :", myMuffin);
        // });
    }
};
