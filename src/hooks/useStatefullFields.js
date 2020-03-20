//src/useStatefulFields.js file localtion:

import React, { useState } from "react";
//useState is basicallly the state equivalent of setState..
export function useStatefulFields() {
    const [values, setValues] = useState({});

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };
    return [values, handleChange];
}
//property 1st Array is used in the state to relate values and the 2nd array
//setValues is to update the values of the state..
//changeEventHandler is to rewrite the handleChange below the const array cmd line..
//[e.target.name] this was not an array and its a variable in this case...
//setValues a bit different than setStates..
//setStates will do like only the state is replaced or overwrite the present states
//whereas the setValues is like adding the value to the current state after this cmd line..
//the only thing we need to make a Change is to copy the old values of the current state and
//include the one you wanna add to the current state along with the new value..
//spreader operator concatanates the old values along with newValues to the state..
//the return in the custom Hook is to pass the values consisting the objects of
//the array from the user input data and the handleChange function itself when the user enter
//in the input fields...
//now the belwo code is to use in in login.js change the export default
//function with the changes done

{
    /*
    import { useStatefulFields } from "./useStaefuleFields";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values); //this cmd line is to passing the values from useStefulFields to the login.js file
    return (
        <form>
            {error && <p>Something Wrong:( </p>}
            <input name="email" type="text" onChange={handleChange} />
            <input name="password" type="password" onChange={handleChange} />
            <button onClick={handleSubmit}>Submit</button>
        </form>
    );
}
*/
}
