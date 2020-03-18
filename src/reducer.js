//src/reducer.js is the file location...

export default function(state = {}, action) {
    if (action.type === "friends-wannabe") {
        return { ...state, friendsWannabes: action.friendsWannabes };
    }

    if (action.type === "acceptFriendRequest") {
        return {
            ...state,
            friendsWannabes: state.friendsWannabes.map(element => {
                if (element.id == action.id) {
                    return { ...element, accepted: true };
                } else {
                    return element;
                }
            })
        };
    }

    if (action.type === "unfriend") {
        console.log(action.friendshipsended);
        return {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(element => {
                console.log("friendsWannabes", state.friendsWannabes);
                console.log("action.id", action.id);
                console.log("element.id", element.id);
                if (element.id !== action.id) {
                    return element;
                }
            })
        };
    }

    if (action.type === "GET_LAST_10") {
        state = {
            ...state,
            msgs: action.chatMessages
        };
    }

    if (action.type === "NEW_MESSAGE") {
        state = {
            ...state,
            msgs: state.msgs.concat(action.chatMessage)
        };
    }

    return state;
}

/*

we write 3 conditionals(if statements) in this file...
*/

//ES6 syntax is used here if there is no state passed create a state as an empty object..
//if there is a state it will pass that state..
//reducer will called automatically..
/*
                   redux
                    |    ^
                    |    | reducer in the file (reducer.js)
                   |     |   action
                   |     |    type:change(in the file actions.js file)
    useSelector    |     | dispatch(happens in the component section of the-
(used in the-     |     | -socialnetwork)
-component)       v
                   friends

REDUX is a function that returns an object..
reducer updates the action like chnaging the state..
reducer makes a copy of the global state and modifies the copy and replace the
old state with the newstate..you cant use push or unshift for the reducer..just
need to make copy of a such array and makes changes to the array...
the change wont seen on the screen with the redux..it wont update it on screen
rather it do it only by action..
So reducer is like immutable technically speaking...and we can only use methods
like example:map, filter, concat, slice and spread(...) operator..in the reducer
which returns a new array..

useSelector Hook Example syntax:
useSelector passes a callback that takes state as an argument..
useSelector(state=> {
return state.first;
});

action creator function (which is a axios request/ajax request)within the
client side communicates with the server side and in the server side the
index.js collects the data from the database and then respond it to the action
in the client side with the outputdata..
then the reducer make a new Global state(new Redux states) and modifies it
followed by passing it to the Friends back the necessary changes to update..

Redux become very useful when you have more nested components(like
component within components) and then passing props within components like
props drilling in that case Redux is more effecient to be handy..
*/
