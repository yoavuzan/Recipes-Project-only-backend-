'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('user_favorites', [
        {
          userId: '5d8fa191-b6dc-4a9a-8078-4b4987474a75', // demoUser --- IGNORE ---
          recipeId: '8fbecc87-f4aa-4314-9d05-1ab7b6d254a6', // Spaghetti Carbonara --- IGNORE ---
          createdAt: new Date()
        },
        {
          userId: '34d04a0a-24c4-407d-976d-5e0723fdda5c', // testUser --- IGNORE ---
          recipeId: '8fbecc87-f4aa-4314-9d05-1ab7b6d254a6', // Chicken Curry --- IGNORE ---
          createdAt: new Date()
        }
      ]);
    },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     */
     await queryInterface.bulkDelete('user_favorites', null, {});

  }
};
