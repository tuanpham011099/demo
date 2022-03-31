'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Clients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                validate: {
                    isEmail: true
                },
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            avatar: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            token: {
                type: Sequelize.STRING
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                default: false
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Clients');
    }
};