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

function getLastTenChatMessages() {
    return db.query(
        `SELECT users.id, users.first, users.last,
                chat.user_id, chat.message, chat.id, chat.created_at
                FROM chat LEFT JOIN users ON users.id = chat.user_id
               ORDER BY chat.id DESC LIMIT 10`
    );
}

function insertNewMessage(user_id, message) {
    return db.query(
        `INSERT INTO chat (user_id, message)
        VALUES ($1, $2)
        RETURNING *`,
        [user_id, message]
    );
}

function getMessageUser(user_id) {
    return db.query(`SELECT  first, last FROM users WHERE id = $1`, [user_id]);
}

function insertExchange(title, city, description, author_user_id) {
    return db.query(
        `INSERT INTO exchange(title, city, description, author_user_id)
VALUES ($1, $2, $3, $4) RETURNING id`,
        [title, city, description, author_user_id]
    );
}

function getLastExchanges() {
    return db.query(
        `SELECT users.id, users.first, users.last,
        exchange.author_user_id, exchange.title, exchange.description, exchange.created_at
        FROM exchange LEFT JOIN users ON users.id = exchange.author_user_id
       ORDER BY exchange.id DESC LIMIT 10`
    );
}

function deleleAccount(user_id) {
    return db.query(
        `DELETE FROM users
        WHERE id = $1`,
        [user_id]
    );
}

function deleleInfoFriendship(user_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE receiver_id = $1 OR sender_id = $1`,
        [user_id]
    );
}

function deleteMsgs(user_id) {
    return db.query(
        `DELETE FROM messages
        WHERE user_id = $1`,
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
exports.getLastTenChatMessages = getLastTenChatMessages;
exports.insertNewMessage = insertNewMessage;
exports.getMessageUser = getMessageUser;
exports.insertExchange = insertExchange;
exports.getLastExchanges = getLastExchanges;
exports.deleleAccount = deleleAccount;
exports.deleleInfoFriendship = deleleInfoFriendship;
exports.deleteMsgs = deleteMsgs;
