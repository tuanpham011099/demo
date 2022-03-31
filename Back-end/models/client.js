'use strict';
const {
    Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Client extends Model {
        //eslint-disable-next-line
        static associate(models) {
            this.belongsToMany(models.Course, {
                through: 'client_classes',
                as: 'classes',
                foreignKey: 'client_id',
                otherKey: "class_id"
            })
        }
    }
    Client.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            },
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
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Client',
        timestamps: false
    });
    return Client;
};