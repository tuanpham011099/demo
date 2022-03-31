'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            this.hasMany(models.Registration, { foreignKey: 'accept_by' })
        }
    }
    Admin.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: 'Admin',
    });
    return Admin;
};