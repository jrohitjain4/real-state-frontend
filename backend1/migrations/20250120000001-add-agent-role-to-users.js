'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'agent' to the role enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" ADD VALUE 'agent';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: PostgreSQL doesn't support removing enum values directly
    // This would require recreating the enum type
    // For now, we'll leave the agent role in place
    console.log('Note: Removing enum values requires recreating the enum type in PostgreSQL');
  }
};
