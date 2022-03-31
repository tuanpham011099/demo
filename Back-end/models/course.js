'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {
            this.belongsToMany(models.Client, {
                through: 'client_classes',
                as: 'students',
                foreignKey: 'class_id',
                otherKey: 'client_id'
            })
            this.hasMany(models.Timetable, {
                foreignKey: "class_id",
                as: "timetable"
            })
        }
    }
    Course.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING
        },
        max_client: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: 'Course',
    });
    return Course;

};