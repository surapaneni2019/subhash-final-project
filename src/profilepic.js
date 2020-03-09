import React from "react";
export default function({ url, first, last, clickHandler }) {
    return (
        <img
            src={url || "/default.png"}
            alt={`${first} ${last}`}
            onClick={clickHandler}
        />
    );
}
