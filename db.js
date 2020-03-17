const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/allspice-socialnetwork"
);

function registerUser(first, last, email, password) {
    return db.query(
        `INSERT INTO users(first, last, email, password)
   VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
}

function verifyUser(email) {
    return db.query(`SELECT password, id FROM users where email=$1`, [email]);
}

function insertResetCode(email, code) {
    return db.query(
        `INSERT INTO password_reset_codes(email, code) VALUES($1, $2) RETURNING id`,
        [email, code]
    );
}

function verifyCode() {
    return db.query(`SELECT * FROM password_reset_codes
WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`);
}

function getInfoUser(id) {
    return db.query(`SELECT *  FROM users WHERE id=$1`, [id]);
}

function updatePassword(password, id) {
    return db.query(`UPDATE users SET password=$1 WHERE id=$2`, [password, id]);
}

function addImage(url, id) {
    return db.query(`UPDATE users SET url=$1 WHERE id=$2 RETURNING image`, [
        url,
        id
    ]);
}
function addBio(id, bio) {
    return db.query(`UPDATE users SET bio=$2 WHERE id=$1 RETURNING bio`, [
        id,
        bio
    ]);
}

function getRecentUsers() {
    return db.query(`SELECT * FROM users ORDER BY ID desc LIMIT 3;`);
}

function getMatchingUsers(val) {
    return db.query(`SELECT * FROM users WHERE first ILIKE $1;`, [val + "%"]);
}

function getFriendshipStatus(otherUser_id, user_id) {
    return db.query(
        `SELECT * FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`,
        [otherUser_id, user_id]
    );
}

function makeFriendRequest(otherUser_id, user_id) {
    return db.query(
        `INSERT INTO friendships(receiver_id, sender_id, accepted)
        VALUES ($1, $2, false) RETURNING *`,
        [otherUser_id, user_id]
    );
}

function acceptFriendRequest(otherUser_id, user_id) {
    return db.query(
        `UPDATE friendships SET accepted=true WHERE sender_id=$1 AND receiver_id=$2`,
        [otherUser_id, user_id]
    );
}

function endFriendship(otherUser_id, user_id) {
    return db.query(
        `DELETE FROM friendships WHERE (receiver_id =$1 AND sender_id =$2)
    OR (receiver_id =$2 AND sender_id =$1) `,
        [otherUser_id, user_id]
    );
}

function getFriendsWannabes(user_id) {
    return db.query(
        `SELECT users.id, first, last, url, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id= $1 AND receiver_id = users.id)`,
        [user_id]
    );
}

exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.insertResetCode = insertResetCode;
exports.verifyCode = verifyCode;
exports.getInfoUser = getInfoUser;
exports.updatePassword = updatePassword;
exports.addImage = addImage;
exports.addBio = addBio;
exports.getRecentUsers = getRecentUsers;
exports.getMatchingUsers = getMatchingUsers;
exports.getFriendshipStatus = getFriendshipStatus;
exports.makeFriendRequest = makeFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.endFriendship = endFriendship;
exports.getFriendsWannabes = getFriendsWannabes;
