CREATE DATABASE IF NOT EXISTS vacations_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE vacations_db;

CREATE TABLE IF NOT EXISTS users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vacations (
    vacationId INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    imageName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO users (firstName, lastName, email, passwordHash, role)
VALUES ('Admin', 'Admin', 'admin@admin.com', '$2b$10$dAaGz9gYDsjORa7S1FBcwugYJhx3L057Co2yQhNLbpwJ35MIHz6nq', 'admin');

INSERT INTO vacations (destination, description, startDate, endDate, price, imageName)
VALUES
('Paris, France', 'Discover the Eiffel Tower, Seine River cruises, museums, cafes, and romantic city walks.', '2026-05-10', '2026-05-17', 1899.00, '1773861478241_774733.jpg'),
('Rome, Italy', 'Enjoy ancient history, the Colosseum, Vatican City, classic piazzas, and authentic Italian food.', '2026-05-22', '2026-05-29', 1740.00, '1773940138026_483274.jpg'),
('Barcelona, Spain', 'Relax on Mediterranean beaches while exploring Gaudi architecture, markets, and lively nightlife.', '2026-06-05', '2026-06-12', 1680.00, '1773943616109_723721.jpg'),
('Amsterdam, Netherlands', 'Cycle through canals, visit world-class museums, and enjoy a laid-back European city break.', '2026-06-18', '2026-06-24', 1590.00, '1773861478241_774733.jpg'),
('Athens, Greece', 'Mix ancient landmarks, hilltop views, seaside neighborhoods, and traditional Greek cuisine.', '2026-07-02', '2026-07-09', 1460.00, '1773940138026_483274.jpg'),
('Prague, Czech Republic', 'Walk through the old town, cross Charles Bridge, and enjoy castles, music, and history.', '2026-07-15', '2026-07-21', 1385.00, '1773943616109_723721.jpg'),
('Vienna, Austria', 'Experience imperial palaces, classical music, elegant streets, and famous coffee houses.', '2026-08-03', '2026-08-10', 1715.00, '1773861478241_774733.jpg'),
('Lisbon, Portugal', 'Ride historic trams, explore colorful neighborhoods, and enjoy Atlantic sunsets and seafood.', '2026-08-20', '2026-08-27', 1525.00, '1773940138026_483274.jpg'),
('London, United Kingdom', 'Visit iconic landmarks, royal parks, museums, theater shows, and diverse neighborhoods.', '2026-09-07', '2026-09-14', 2140.00, '1773943616109_723721.jpg'),
('Berlin, Germany', 'Explore modern culture, historic memorials, vibrant districts, and excellent food scenes.', '2026-09-21', '2026-09-28', 1620.00, '1773861478241_774733.jpg'),
('Dubai, United Arab Emirates', 'Combine luxury shopping, skyline views, desert adventures, beaches, and modern attractions.', '2026-10-08', '2026-10-14', 2490.00, '1773940138026_483274.jpg'),
('New York City, USA', 'See Broadway, Central Park, skyline viewpoints, famous neighborhoods, and nonstop city energy.', '2026-10-25', '2026-11-01', 2760.00, '1773943616109_723721.jpg');
