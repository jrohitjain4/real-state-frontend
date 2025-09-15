
// models/category.model.js
module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        icon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        displayOrder: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        metaTitle: {
            type: Sequelize.STRING,
            allowNull: true
        },
        metaDescription: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'categories'
    });

    return Category;
};