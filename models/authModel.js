//load users db/MODEL
const bcrypt = require("bcrypt");
const { sequelize } = require("../DB/models/index.js");
const { v4: UUID } = require("uuid");

// Function to authenticate user
async function login(email, password) {
    const query = `SELECT * FROM users WHERE email = :email`;
    const [results] = await sequelize.query(query, {
        replacements: { email },
    });

    const user = results[0]; // user object, or undefined if not found

    if (!user) return null; // no user found

    console.log("Comparing passwords:", password, user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (isMatch) {
        return user;
    }

    return null; // password does not match
}

async function register(email, password, username, firstName, lastName) {
    // Check if user already exists 
    const checkQuery = `SELECT * FROM users WHERE email = :email`;
    const [existingUsers] = await sequelize.query(checkQuery, {
        replacements: { email },
    });

    if (existingUsers.length > 0) {
        return null; 
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const createQuery = `
        INSERT INTO users (id, username,email, password,firstName,lastName, createdAt, updatedAt)
        VALUES (:id,:username, :email, :password, :firstName, :lastName, NOW(), NOW())
    `;
    
    const [result,metadata] = await sequelize.query(createQuery, {
        replacements: { id: UUID(), username, email, password: hashedPassword, firstName, lastName },
    });
    
    const Query = `SELECT * FROM users WHERE email = :email`;
    const [user] = await sequelize.query(Query, {
        replacements: { email },
    });

    return user[0]; // return the newly created user
}

module.exports = {
    login,
    register,
};