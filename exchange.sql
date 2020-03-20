DROP TABLE IF EXISTS exchange;

CREATE TABLE exchange (
    id SERIAL PRIMARY KEY,
    author_user_id INT NOT NULL REFERENCES users(id),
    title VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
