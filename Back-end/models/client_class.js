'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Client_class extends Model {
        // eslint-disable-next-line
        static associate(models) {
            this.belongsTo(models.Course, { foreignKey: 'id' });
            this.belongsTo(models.Client, { foreignKey: 'id' })
        }
    }
    Client_class.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
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
        }
    }, {
        sequelize,
        modelName: 'Client_class',
    });
    return Client_class;
};