import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { receiveFriendsWannabes } from "./actions.js";
import { acceptFriendRequest } from "./actions.js";
import { unfriend } from "./actions.js";

import { Link } from "react-router-dom";

export default function Friends() {
    const friends = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => {
                return friend.accepted == true;
            })
    );

    console.log(friends);

    const requesters = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => {
                return friend.accepted == false;
            })
    );

    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            dispatch(receiveFriendsWannabes());
        })();
    }, []);

    return (
        <div className="friendswannabes">
            <div className="friends-requesters-container">
                <span className="section-title">Friends</span>
                {requesters &&
                    requesters.map(user => (
                        <div
                            className="friendwannabe-single-user"
                            key={user.id}
                        >
                            <span className="friends-requesters">
                                FRIEND REQUEST
                            </span>

                            <img
                                className="image-friends-requesters"
                                src={user.url || "/defaultimage.jpg"}
                                alt={(user.first, user.last)}
                            />
                            <Link to={`/user/${user.id}`}>
                                {user.first}&nbsp;
                                {user.last}
                            </Link>
                            <button
                                className="friends-accept button-friends-requesters"
                                onClick={() =>
                                    dispatch(acceptFriendRequest(user.id))
                                }
                            >
                                Accept Friend Request
                            </button>
                        </div>
                    ))}
            </div>
            <div className="friends-requesters-container">
                {friends &&
                    friends.map(user => (
                        <div
                            className="friendwannabe-single-user"
                            key={user.id}
                        >
                            <span className="friends-requesters">
                                Current Friend
                            </span>

                            <img
                                className="image-friends-requesters"
                                src={user.url || "/defaultimage.jpg"}
                                alt={(user.first, user.last)}
                            />
                            <Link to={`/user/${user.id}`}>
                                {user.first}&nbsp;
                                {user.last}
                            </Link>
                            <button
                                className="friends-unfriend button-friends-requesters"
                                onClick={() => dispatch(unfriend(user))}
                            >
                                End Friendship
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
