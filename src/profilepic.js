import React from "react";
export default function({ url, first, last, clickHandler }) {
    return (
        <div className="profile-top">
            <img
                src={url || "/defaultimage.jpg"}
                alt={`${first} ${last}`}
                onClick={clickHandler}
            />
            <p>
                {first} {last}
            </p>
        </div>
    );
}
