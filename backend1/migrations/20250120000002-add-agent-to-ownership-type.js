'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_properties_ownershipType" ADD VALUE 'agent';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting an ENUM addition is complex and often involves
    // creating a new ENUM type, updating the column to use it,
    // and then dropping the old ENUM. For simplicity in a down migration,
    // we'll log a warning as direct removal of an ENUM value
    // is not supported by PostgreSQL without recreating the type.
    console.warn('Down migration for adding "agent" to ownershipType is complex and not fully implemented. Manual intervention might be required if you need to remove the "agent" enum value and its associated data.');
    // A more robust down migration would involve:
    // 1. Creating a new ENUM type without 'agent'.
    // 2. Updating the 'ownershipType' column to use the new ENUM type.
    // 3. Dropping the old ENUM type.
    // 4. Handling data that might have 'agent' ownershipType (e.g., setting to 'owner').
  }
};
