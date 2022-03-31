'use strict';
const bcrypt = require('bcryptjs');
require('dotenv').config();
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Admins', [{
            name: 'John Doe',
            email: process.env.ADMIN_MAIL,
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
            avatar: 'https://bloganh.net/wp-content/uploads/2021/03/chup-anh-dep-anh-sang-min.jpg',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Admins', null, {});
    }
};