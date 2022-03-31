const { Course, Timetable, Client } = require("../models")
const { missingData } = require('../utils/dataError');

function messageToUser(res, status, message) {
    return res.status(status).json(message);
}

exports.listClass = async(req, res) => {
    Course.findAll({
            include: [{
                model: Timetable,
                as: 'timetable',
                attributes: ['week_day', 'from', 'to']
            }, {
                model: Client,
                as: 'students',
                attributes: ['id', 'email', 'name', 'avatar'],
                through: {
                    attributes: []
                }
            }],
            attributes: ['id', 'name', 'description', 'max_client']
        })
        .then(result => res.status(200).json(result))
        .catch(error => console.log(error))

};

exports.details = async(req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: 'Provide class ID' })
    Course.findByPk(id, {
            include: [{
                model: Timetable,
                as: 'timetable',
                attributes: ['id', 'week_day', 'from', 'to']
            }]
        })
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json(error))
}

exports.addCourse = async(req, res) => {
    const { name, description, max_client } = req.body;
    if (!name || !description || !max_client)
        return res.status(400).json({ msg: "Data missing", errors: missingData('name', 'description') });
    if (max_client < 1) return res.status(400).json({ msg: 'max_client must more than 1' })
    const result = await Course.findOne({ where: { name } });
    if (result) return res.status(400).json({ msg: "Course already exist" });
    Course.create({ name, description, max_client })
        .then(() => res.status(201).json({ msg: "Course create" }))
        .catch(error => res.status(400).json(error))
};

exports.deleteCourse = async(req, res) => {
    const { id } = req.params;
    let course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ msg: "Class not found" });
    try {
        await course.destroy();
    } catch (error) {
        return res.status(400).json(error)
    }
    res.status(200).json({ msg: "Class deleted" });
};

exports.updateCourse = async(req, res) => {
    const { id } = req.params;
    const { name, description, max_client } = req.body;
    let course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ msg: "Class not found" });
    course.name = name;
    course.description = description;
    course.max_client = max_client;
    try {
        await course.save();
    } catch (error) {
        messageToUser(res, 400, error)
    }
    messageToUser(res, 200, { msg: "course updated" })
};