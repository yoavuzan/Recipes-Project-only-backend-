'use strict';

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('recipes', [{
        id: uuidv4(),
        title: 'Spaghetti Carbonara',
        description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
        ingredients: JSON.stringify(['spaghetti', 'eggs', 'parmesan cheese', 'pancetta', 'black pepper']),
        instructions: JSON.stringify(['Cook spaghetti', 'Fry pancetta', 'Mix eggs and cheese', 'Combine all']),
        cookingTime: 20,
        servings: 2,
        difficulty: 'easy',
        imageUrl: 'http://example.com/spaghetti-carbonara.jpg',
        isPublic: true,
        userId: "34d04a0a-24c4-407d-976d-5e0723fdda5c",
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('recipes', null, {});
  }
};
