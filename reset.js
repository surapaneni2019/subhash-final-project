import React from "react";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDisplay: 1
        };
    }
    render() {
        const { currentDisplay } = this.state;
        // let elem;
        // if(currentDisplay == 1) {
        //     let elem = (
        //         <div>
        //         <inout/>
        //         </div>
        //     );
        // }else
        return (
            <div>
                {currentDisplay == 1 && (
                    <div>
                        <input />
                    </div>
                )}
                {currentDisplay == 2 && (
                    <div>
                        <input />
                        <input />
                    </div>
                )}
            </div>
        );
    }
}

//a && b works if one in the left is truthy it picks up one in the right
//if the one in the left is falsy it picksup the one in the left one in the syntax
