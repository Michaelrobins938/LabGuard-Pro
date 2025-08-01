CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    character VARCHAR(255),
    model VARCHAR(255),
    level INT DEFAULT 1,
    exp INT DEFAULT 0,
    skills JSON,
    alignment VARCHAR(255),
    companion VARCHAR(255)
);
