//src/actions.js is the file location...

import axios from "./axios";

export async function receiveFriendsWannabes() {
    try {
        const { data } = await axios.get(`/friends-wannabes`);
        console.log("data - receiveFriendsWannabes", data);
        return {
            type: "friends-wannabe",
            friendsWannabes: data
        };
    } catch (error) {
        console.log("error in receiveFriendsWannabes: ", error);
    }
}

export async function acceptFriendRequest(user) {
    try {
        const { data } = await axios.post(`/accept-friend-request`, {
            user: user
        });
        console.log("data - acceptFriendRequest: ", data);
        return {
            type: "acceptFriendRequest",
            id: data.id
        };
    } catch (error) {
        console.log("error in acceptFriendRequest: ", error);
    }
}

export async function unfriend(user) {
    try {
        const { data } = await axios.post(`/end-friendship`, {
            user: user
        });
        console.log("data - unfriend: ", data);
        return {
            type: "friendships-ended",
            id: data.otherUser_id
        };
    } catch (error) {
        console.log("error in unfriend: ", error);
    }
}

/* we write 3 functions within in this file:

1) receiveFriendsWannabe is the function the friend request:if empty array(value 1)
is what you get means there is no friends request in your DB or your db query
(value 2) has an error within it..

2) acceptFriendRequest makes a post request to the server to accept the
friendshipand returns the object of the type and the id of the user the friends
who has acceptd..

3) unfriend function will make POST reuest to the server to end the frndship..
which returns the object and the type of the id of user whose frndship has
ended..

*/
