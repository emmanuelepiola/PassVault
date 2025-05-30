CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    shared SMALLINT NOT NULL DEFAULT 0 CHECK (shared IN (0, 1))
);
-- Tabella di relazione per cartelle condivise
CREATE TABLE folder_users (
    folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (folder_id, user_id)
);
-- Prevent adding folder_users entries if folder is not shared
CREATE OR REPLACE FUNCTION enforce_folder_shared() RETURNS TRIGGER AS $$ BEGIN IF (NEW.folder_id IS NOT NULL) THEN IF (
        SELECT shared
        FROM folders
        WHERE id = NEW.folder_id
    ) = 0 THEN RAISE EXCEPTION 'Cannot add users to a non-shared folder %',
    NEW.folder_id;
END IF;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_enforce_folder_shared BEFORE
INSERT
    OR
UPDATE ON folder_users FOR EACH ROW EXECUTE FUNCTION enforce_folder_shared();
-- Handle automatic insert/delete of folder_users when shared flag changes
CREATE OR REPLACE FUNCTION handle_folder_shared() RETURNS TRIGGER AS $$ BEGIN IF (TG_OP = 'INSERT') THEN IF NEW.shared = 1 THEN
INSERT INTO folder_users(folder_id, user_id)
VALUES (NEW.id, NEW.created_by) ON CONFLICT DO NOTHING;
END IF;
ELSIF (TG_OP = 'UPDATE') THEN IF (
    OLD.shared = 0
    AND NEW.shared = 1
) THEN
INSERT INTO folder_users(folder_id, user_id)
VALUES (NEW.id, NEW.created_by) ON CONFLICT DO NOTHING;
ELSIF (
    OLD.shared = 1
    AND NEW.shared = 0
) THEN
DELETE FROM folder_users
WHERE folder_id = NEW.id;
END IF;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_handle_folder_shared
AFTER
INSERT
    OR
UPDATE OF shared ON folders FOR EACH ROW EXECUTE FUNCTION handle_folder_shared();
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
-- Table for password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE
);