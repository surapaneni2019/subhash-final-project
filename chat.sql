DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    message VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat (user_id, message) VALUES (
    '1',
    'Well done'
);

INSERT INTO chat (user_id, message) VALUES (
    '45',
    'Excellent Job'
);

INSERT INTO chat (user_id, message) VALUES (
    '124',
    'Best bet'
);

INSERT INTO chat (user_id, message) VALUES (
    '166',
    'Start of the Day'
);

INSERT INTO chat (user_id, message) VALUES (
    '114',
    'Go ahead!'
);
