import React, { useState, useEffect } from "react";
import axios from "./axios";
import Moment from "react-moment";

export default function Exchange() {
    const [exchangeInfo, setexchangeInfo] = useState();
    const [newExchange, setnewExchange] = useState();
    const [newPost, setnewPost] = useState();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/getexchanges");
            console.log(data, "data get exchange");

            setexchangeInfo(data);
            () => console.log("exchangeInfo", exchangeInfo);
        })();
    }, []);

    const handleClick = e => {
        console.log("handleee");
        e.preventDefault();
        axios
            .post("/postexchange", newExchange)
            .then(function(data) {
                console.log("data in post exchange", data);
                setnewPost(data.data);
                () => console.log("exchangeInfo in submit", newPost);
                return;
            })
            .catch(function(error) {
                console.log("error in submit exchange", error);
            });
    };

    const handleChange = e => {
        setnewExchange({ ...newExchange, [e.target.name]: e.target.value });
        () => console.log("exchangeInfo in handleChange", newExchange);
        return;
    };

    return (
        <div className="exchange-wrapper">
            <div className="exchange">
                <span className="section-title events-title"> EXCHANGE </span>

                <form className="form-exchange">
                    <label className="exchange" htmlFor="title">
                        exchange title
                    </label>
                    <input
                        placeholder="exchange title"
                        name="title"
                        type="text"
                        autoComplete="off"
                        onChange={handleChange}
                    />
                    <label className="exchange" htmlFor="title">
                        city
                    </label>
                    <input
                        placeholder="city"
                        name="city"
                        type="text"
                        autoComplete="off"
                        onChange={handleChange}
                    />
                    <label className="exchange" htmlFor="title">
                        description
                    </label>
                    <textarea
                        placeholder="description"
                        name="description"
                        type="text"
                        autoComplete="off"
                        onChange={handleChange}
                    ></textarea>

                    <button className="exchange" onClick={handleClick}>
                        SUBMIT
                    </button>
                </form>
            </div>
            {newPost && (
                <div className="exchange-list newexchange">
                    <p>
                        {newPost.first}, {newPost.last}
                    </p>
                    <p>
                        {newPost.title}, {newPost.description}
                    </p>
                    <p>
                        <Moment fromNow>{newPost.created_at}</Moment>
                    </p>
                </div>
            )}

            <div className="echange-wrapper">
                {exchangeInfo &&
                    exchangeInfo.map(exchange => (
                        <div className="exchange-list" key={exchange.id}>
                            <p>
                                {exchange.first}, {exchange.last}
                            </p>
                            <p>
                                {exchange.title}, {exchange.description}
                            </p>
                            <p>
                                <Moment fromNow>{exchange.created_at}</Moment>
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
