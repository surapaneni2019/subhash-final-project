import React from "react";
export default function({
    url = "/defaultimage.jpg",
    first,
    last,
    toggleModal
}) {
    console.log("url in profilepic: ", url);
    return (
        <img
            className="profilepic pic-header"
            onClick={toggleModal}
            src={url || "/defaultimage.jpg"}
            alt={`${first} ${last}`}
        />
    );
}
