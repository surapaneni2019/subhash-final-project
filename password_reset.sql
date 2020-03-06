---DROP TABLE IF EXISTS users;

CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    code VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
