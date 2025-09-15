// migrations/XXXXXXXXXXXXXX-add-kyc-fields-to-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add KYC and profile fields
    await queryInterface.addColumn('users', 'profilePhoto', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'aadharNumber', {
      type: Sequelize.STRING(12),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'aadharPhoto', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'panNumber', {
      type: Sequelize.STRING(10),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'panPhoto', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'city', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'state', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'pincode', {
      type: Sequelize.STRING(6),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'profileCompleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('users', 'kycVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('users', 'profileCompletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all added columns in reverse order
    await queryInterface.removeColumn('users', 'profileCompletedAt');
    await queryInterface.removeColumn('users', 'kycVerified');
    await queryInterface.removeColumn('users', 'profileCompleted');
    await queryInterface.removeColumn('users', 'pincode');
    await queryInterface.removeColumn('users', 'state');
    await queryInterface.removeColumn('users', 'city');
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.removeColumn('users', 'panPhoto');
    await queryInterface.removeColumn('users', 'panNumber');
    await queryInterface.removeColumn('users', 'aadharPhoto');
    await queryInterface.removeColumn('users', 'aadharNumber');
    await queryInterface.removeColumn('users', 'profilePhoto');
  }
};