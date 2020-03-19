
DROP TABLE address;
DROP TABLE tracking; 
DROP TABLE tracker;
DROP TABLE users;

CREATE TABLE users (
  ID                    SERIAL PRIMARY KEY,
  name                  VARCHAR(30) UNIQUE NOT NULL,
  email                 VARCHAR(30) UNIQUE NOT NULL,
  password              VARCHAR(100) NOT NULL,
  documento             VARCHAR(14) UNIQUE NOT NULL 
);

INSERT INTO users (name, email, password, documento) VALUES 
    ('Juliano Longo', 'longo@heroku.com', 'pwd12345jwt', '22233344477')
  , ('Larissa Longo', 'larissa@heroku.com', 'pwd333444jwt', '11133344477')
  , ('Matheus Longo', 'matheus@heroku.com', 'pwd777444jwt', '77733344477');

CREATE TABLE address (
  id                    SERIAL PRIMARY KEY,
  user_id               BIGINT UNIQUE NOT NULL,
  street                VARCHAR(200) NOT NULL,
  neighborhood          VARCHAR(100) NOT NULL,
  number                VARCHAR(5) NOT NULL,
  zip_code              VARCHAR(9) NOT NULL,
  city                  VARCHAR(100) NOT NULL,
  state                 VARCHAR(2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE(id, user_id)
);

INSERT INTO address (user_id, street, neighborhood, number, zip_code, city, state) VALUES 
    (1, 'Street Saint Paul', 'Melbourne', '100', '13045-333', 'California', 'CA')
  , (2, 'Street Saint Paul', 'Melbourne', '100', '13045-333', 'California', 'CA')
  , (3, 'Manhattan', 'Harlem', '77', '13045-333', 'New York', 'NY');


CREATE TABLE tracker(
    id                  SERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL,
    tracked_number      NUMERIC(11) UNIQUE NOT NULL,
    UNIQUE(user_id, tracked_number),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE tracking (
    id                  SERIAL PRIMARY KEY,
    tracker_id          BIGINT NOT NULL,
    DATE_HOUR           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitude            VARCHAR(8) NOT NULL,
    longitude           VARCHAR(8) NOT NULL,
    FOREIGN KEY (tracker_id) REFERENCES tracker (id)
);