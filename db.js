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
        `INSERT INTO password_reset_codes(code, email) VALUES($1, $2) RETURNING id`,
        [email, code]
    );
}

function verifyCode() {
    return db.query(`SELECT * FROM password_reset_codes
WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`);
}

function updatePassword(password, id) {
    return db.query(`UPDATE users SET password=$1 WHERE id=$2`, [password, id]);
}

function addImage(url, id) {
    return db.query(`UPDATE users SET url=$1 WHERE id=$2`, [url, id]);
}
function addBio(bio, id) {
    return db.query(`UPDATE users SET bio=$1 WHERE id=$2`, [bio, id]);
}

exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.insertResetCode = insertResetCode;
exports.verifyCode = verifyCode;
exports.updatePassword = updatePassword;
exports.addImage = addImage;
exports.addBio = addBio;
