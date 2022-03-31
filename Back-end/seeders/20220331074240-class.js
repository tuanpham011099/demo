'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Courses', [{
            name: 'John Doe',
            description: "testing class",
            max_client: 69
        }]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Courses', null, {});
    }
};