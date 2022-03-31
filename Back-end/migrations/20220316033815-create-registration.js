'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Registrations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            client_id: {
                type: Sequelize.INTEGER,
                allowNull: false,

            },
            class_id: {
                allowNull: false,
                type: Sequelize.INTEGER,

            },
            accept_by: {
                type: Sequelize.INTEGER,
                default: "null",

            },
            status: {
                type: Sequelize.STRING,
                default: "pending"
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Registrations');
    }
};