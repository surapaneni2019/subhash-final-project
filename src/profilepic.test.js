//src/profilepic.test.js file location..test('renders defalut image when there
// is no url prop')callback..
import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

test("renders default image when there is no url prop", () => {
    const { container } = render(<ProfilePic />);
    // console.log(container.querySelector("img").src);
    expect(container.querySelector("img").src).toContain("/defaultimage.jpg");
    // expect(container.querySelector("img").src).toContain("/adsadaldjlsajdlsadefault.jpg");
});

//run the test same like in terminal npm test
//now the test passes for exact ones and fails with the gibberig ones
//sanity check now by passing some string so that it fails which we wanted...
test("renders image with specified url prop", () => {
    const { container } = render(<ProfilePic url="/some-url.gif" />);
    expect(container.querySelector("img").src).toContain("/some-url.gif");
    // expect(container.querySelector("img").src).toContain("/sosdasdkjsahdkjsame-url.gif");
});

test("renders image with first and last props in alt", () => {
    const { container } = render(
        <ProfilePic first="subhash" last="surpananei" />
    );
    expect(container.querySelector("img").alt).toContain("/subhash surapaneni");
    // expect(container.querySelector("img").alt).toContain("/subhsdasdsaash surapaneni");
});
test("onclicks prop gets called when an image is clicked", () => {
    const onClick = jest.fn(); //here onClick is the mockfunction...
    //mock function is to check whether its called/invoked when oncliked is done waht we expected...

    const { container } = render(<ProfilePic onClick={onClick} />); //waht is in my profilepic written this on the left whether the name refernceing to the profilepic..
    const img = container.querySelector("img");
    fireEvent.click(img);
    // fireEvent.click(img);
    // fireEvent.click(img);
    //here we are triggering the event not expeting teh event later we do the expect stuff..
    expect(onClick.mock.calls.length).toBe(1);
    // expect(onClick.mock.calls.length).toBe(3); to check whether its triggered 3 times or not...
    // expect(onClick.mock.calls.length).toBe(1sadsadsadsa);
});
//
//
//testing something asynchronous now:
//working together with app.js file

//Now we test to find out that the div is rendered only after the asynchronous function is done
//componentDidMount is first finished and only then the div is rendered..
