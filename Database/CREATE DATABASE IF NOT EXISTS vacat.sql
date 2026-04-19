CREATE DATABASE IF NOT EXISTS vacations_db;
USE vacations_db;

CREATE TABLE IF NOT EXISTS users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vacations (
    vacationId INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    imageName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    likeId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    vacationId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_vacation_like (userId, vacationId),
    CONSTRAINT fk_likes_users
        FOREIGN KEY (userId) REFERENCES users(userId)
        ON DELETE CASCADE,
    CONSTRAINT fk_likes_vacations
        FOREIGN KEY (vacationId) REFERENCES vacations(vacationId)
        ON DELETE CASCADE
);

INSERT INTO users (firstName, lastName, email, passwordHash, role)
VALUES ('Admin', 'Admin', 'admin@admin.com', '$2a$10$Y6z8xW6K7vX8zTn7n4h6UeA5dK0rF9j4F7r4Q0Sg6G8gT3sM3Tn2K', 'admin');