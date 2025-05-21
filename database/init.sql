CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
-- Tabella di relazione per cartelle condivise
CREATE TABLE folder_users (
    folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (folder_id, user_id)
);
CREATE TABLE password (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    folder_id INTEGER REFERENCES folders(id) ON DELETE
    SET NULL,
        security INTEGER CHECK (
            security BETWEEN 1 AND 3
        ),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);