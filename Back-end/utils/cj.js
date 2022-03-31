const { Course, Client, Timetable } = require("../models/index");
const { reminder } = require("./sendMail");
const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const Job = async() => {
    let date = new Date();
    console.log(dayOfWeek[date.getDay()]);

    let results = await Course.findAll({
        include: [{
            model: Client,
            as: 'students',
            attributes: ['email'],
            through: {
                attributes: []
            }
        }, {
            model: Timetable,
            as: 'timetable',
            where: { week_day: dayOfWeek[date.getDay()] }
        }],
    })
    results.map(result => {
        const emails = result['students'].map(student => student['email']);
        reminder(emails, result.name, result['timetable'][0].from);
    })
};
module.exports = Job;