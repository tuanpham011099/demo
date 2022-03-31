'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Timetables', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            class_id: {
                type: Sequelize.INTEGER,
                allowNull: false,

            },
            week_day: {
                type: Sequelize.STRING
            },
            from: {
                type: Sequelize.TIME,
                set(valueToBeSet) {
                    this.setDataValue('from', valueToBeSet)
                }
            },
            to: {
                type: Sequelize.TIME,
                set(valueToBeSet) {
                    this.setDataValue('to', valueToBeSet)
                }
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
        await queryInterface.dropTable('Timetables');
    }
};