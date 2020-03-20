//src/useAuthSubmit.js file location:

import { React, useState } from "react";
import axios from "./axios";

export function useAuthSubmit(url, values) {
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        axios
            .post(url, values)
            .then(({ data }) => {
                if (!data.success) {
                    setError(true);
                } //its a genric error message but can be handled indvidually how you like to setup..
                else {
                    location.replace("/");
                }
            })
            .catch(error => {
                console.log("error in authentification: ", error);
                setError(true); //setting msgs to true is a generic error msg..
                //but setting it to setError(error.message); displays the specific message to be displayed...
            });
    };
    return [error, handleSubmit];
    //to return multiple functions we need to keep them in a array..
}

/*
_ can be used to replace the () within the functional cmd syntax..
function components are easier to use and mush faster then class components..
*/
