-- 1. Create the database
CREATE DATABASE IF NOT EXISTS recipe_db;
USE recipe_db;

-- 2. Create the users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY, -- UUID stored as string
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- hashed password
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_username_length CHECK (CHAR_LENGTH(username) >= 3 AND CHAR_LENGTH(username) <= 30),
    CONSTRAINT chk_email_format CHECK (email LIKE '_%@_%._%')
);

-- 3. Insert example user (replace values with real ones)
INSERT INTO users (id, username, email, password, firstName, lastName)
VALUES (
    UUID(), 
    'testuser', 
    'test@example.com', 
    '$2b$10$hashedpasswordexample1234567890', 
    'John', 
    'Doe'
);
-- 4. Create the recipes table and user_favorites table

-- 1. Recipes table
CREATE TABLE recipes (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients JSON, -- array of ingredients
    instructions JSON, -- array of steps
    cookingTime INT,
    servings INT,
    difficulty ENUM('easy', 'medium', 'hard'),
    imageUrl VARCHAR(500),
    isPublic BOOLEAN DEFAULT TRUE,
    userId CHAR(36),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_recipes_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. UserFavorites table (Many-to-Many relationship)
CREATE TABLE user_favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    recipeId CHAR(36) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorites_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_recipe FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_recipe UNIQUE (userId, recipeId) -- prevent duplicates
);

-- 3. Example inserts

-- Example recipe linked to existing user
INSERT INTO recipes (
    id, title, description, ingredients, instructions, cookingTime, servings, difficulty, imageUrl, userId
) VALUES (
    UUID(),
    'Spaghetti Carbonara',
    'Classic Italian pasta with eggs, cheese, pancetta, and pepper.',
    JSON_ARRAY('spaghetti', 'eggs', 'pancetta', 'parmesan cheese', 'black pepper'),
    JSON_ARRAY('Cook spaghetti until al dente.', 'Fry pancetta until crispy.', 'Mix eggs and cheese.', 'Combine everything.'),
    25,
    2,
    'medium',
    '/images/carbonara.jpg',
    (SELECT id FROM users WHERE username = 'testuser' LIMIT 1)
);

-- Example favorite (user favorites a recipe)
INSERT INTO user_favorites (userId, recipeId)
VALUES (
    (SELECT id FROM users WHERE username = 'testuser' LIMIT 1),
    (SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara' LIMIT 1)
);
