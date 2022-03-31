'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Timetable extends Model {
        static associate(models) {
            this.belongsTo(models.Course, { foreignKey: 'id' });
        }
    }
    Timetable.init({
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Course',
                key: 'id'
            }
        },
        week_day: {
            type: DataTypes.STRING
        },
        from: {
            type: DataTypes.TIME,
            set(valueToBeSet) {
                this.setDataValue('from', valueToBeSet)
            }
        },
        to: {
            type: DataTypes.TIME,
            set(valueToBeSet) {
                this.setDataValue('to', valueToBeSet)
            }
        }
    }, {
        sequelize,
        modelName: 'Timetable',
    });
    return Timetable;
};