"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        username: "demoUser",
        email: "demo@example.com",
        password: await bcrypt.hash("1234", 10),
        firstName: "Demo",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: "testUser",
        email: "test@example.com",
        password: await bcrypt.hash("1234", 10),
        firstName: "Test",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
