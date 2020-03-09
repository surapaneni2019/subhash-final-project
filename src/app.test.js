//src/app.test.js is the file location used for..

import React from "react";
import App from "./app";
import axios from "./axios";
import { render, waitForElement } from "@testing-library/react";

//automatic mock jest makes the copy of the original app.js axios get methods
jest.mock("./axios");
//these axios.get methods are all the fake ccopies of original axios.get...
test("app renders correctly", async () => {
    axios.get.mockResolvedValue({
        data: {
            id: 1,
            first: "subhash",
            last: "surapaneni",
            url: "/subhash.jpg"
        }
    });
    const { container } = render(<App />);
    await waitForElement(() => container.querySelector("div"));
    // console.log("inner HTMLdata: ", container.innerHTML);
    expect(container.innerHTML).toContain("<div>");
});

//waitForElement is a method which makes the div element to render only after the
//data is runned(async function)...
