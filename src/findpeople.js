import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUser] = useState();
    const [searchValue, setsearchValue] = useState({ val: "" });
    const [results, setResults] = useState();
    const [noResult, setnoResults] = useState();

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get("/api/recentusers");
            console.log("other users: ", data);
            setUser(data);

            const searchData = await axios.get(`/search/${searchValue.val}`);
            const recentUsers = document.querySelector("div.recent-users");
            document.addEventListener("keydown", function(e) {
                if (e.keyCode === 13 && !abort) {
                    //console.log("searchData", searchData.data);

                    setResults(searchData.data);
                    recentUsers.style.display = "none";
                    setnoResults(false);

                    if (
                        searchData.data === undefined ||
                        searchData.data.length === 0
                    ) {
                        setnoResults(true);
                    }
                }
            });
        })();

        return () => {
            abort = true;
        };
    }, [searchValue]);

    return (
        <div>
            <div className="find-people">
                <span className="section-title">Find People</span>
                <input
                    className="find-people"
                    onChange={({ target }) =>
                        setsearchValue({
                            val: target.value
                        })
                    }
                    placeholder="For whom are you looking"
                />
                <div className="otherprofiles-wrapper">
                    <div className="recent-users">
                        {users && (
                            <span className="findpeople">
                                most recent users
                            </span>
                        )}
                        {users &&
                            users.map(user => (
                                <div key={user.id} className="otherprofiles">
                                    <img
                                        className="otherprofile"
                                        src={
                                            user.url ||
                                            "/default-user-avatar.png"
                                        }
                                        alt={(user.first, user.last)}
                                    />

                                    <Link to={`/user/${user.id}`}>
                                        {user.first}&nbsp;
                                        {user.last}
                                    </Link>
                                </div>
                            ))}
                    </div>

                    {results &&
                        results.map(user => (
                            <div key={user.id} className="otherprofiles">
                                <img
                                    className="otherprofile"
                                    src={user.url || "/defaultimage.jpg"}
                                    alt={(user.first, user.last)}
                                />
                                <Link to={`/user/${user.id}`}>
                                    {user.first}&nbsp;
                                    {user.last}
                                </Link>
                            </div>
                        ))}

                    {noResult && (
                        <span className="findpeople"> no results found </span>
                    )}
                </div>
            </div>
        </div>
    );
}
