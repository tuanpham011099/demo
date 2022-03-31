'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Registration extends Model {
        static associate(models) {
            this.belongsTo(models.Course, { foreignKey: 'class_id' });
            this.belongsTo(models.Client, { foreignKey: 'class_id' });
            this.belongsTo(models.Admin, { foreignKey: 'accept_by' });
        }
    }
    Registration.init({
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Client',
                key: 'id'
            }
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Course',
                key: 'id'
            }
        },
        accept_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Admin',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "pending"
        }
    }, {
        sequelize,
        modelName: 'Registration',
    });
    return Registration;
};