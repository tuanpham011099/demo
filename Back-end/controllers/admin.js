const { Admin, Timetable, Course, Client } = require("../models");
const bcrypt = require("bcryptjs");
const uploadImg = require("../utils/cloudinary");
const { isRightTime, missingData, validDay, validateEmail } = require("../utils/dataError");
const jwt = require("jsonwebtoken");
const day = require('dayjs');
const customFormat = require('dayjs/plugin/customParseFormat');
const duration = require('dayjs/plugin/duration');
day.extend(customFormat)
day.extend(duration)


exports.profile = (req, res) => {
    const { id } = req.params;
    Admin.findByPk(id, { attributes: { exclude: ['password'] } })
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json(error));
}

exports.createAdmin = async(req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
        return res.status(400).json({ msg: "Data missing", errors: missingData('name', 'email', 'password') });
    if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid email format" });
    const result = await Admin.findOne({ where: { email } });
    if (result) return res.status(400).json({ msg: "Admin exist" });
    const hash = await bcrypt.hash(password, 10);
    let avatar = null;
    if (req.file) {
        avatar = await uploadImg(req.file.path);
    }
    try {
        await Admin.create({ email, password: hash, name, avatar });
    } catch (error) {
        return res.status(400).json(error)
    }
    res.status(201).json({ msg: `Admin ${email} created` });
};

exports.login = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Data missing", errors: missingData('email', 'password') });
    await Admin.findOne({ where: { email } })
        .then(result => {
            if (!result) return res.status(404).json({ msg: "wrong email" });
            bcrypt.compare(password, result.password, (error, success) => {
                if (!success || error) return res.status(400).json({ msg: 'Wrong password' })
                const token = jwt.sign({ email, id: result.id, admin: true }, process.env.SECRET, { expiresIn: '24h' });
                res.status(200).json({ id: result.id, email: result.email, name: result.name, avatar: result.avatar, is_active: result.is_active, token });
            })
        })
        .catch(error => console.log(error))
};

exports.updateAdmin = async(req, res) => {
    const { id } = req.params
    const { email, name } = req.body;
    if (!id || !email || !name) return res.status(400).json({ msg: "Data missing", errors: missingData('id', 'email', 'name') });
    const result = await Admin.findByPk(id);
    if (!result) return res.status(404).json({ msg: "User not found" });
    result.name = name;
    if (req.file) {
        let avatar = await uploadImg(req.file.path);
        result.avatar = avatar;
    }
    let existMail = await Admin.findOne({ where: { email }, attributes: { exclude: ['password'] } });
    if (result.email !== email && !existMail) {
        result.email = email;
    }
    try {
        await result.save();
    } catch (error) {
        res.status(400).json(error);
    }
    res.status(200).json({ msg: "Admin updated", admin: result });
}

exports.changePassword = async(req, res) => {
    const { id } = req.params;
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) return res.status(400).json({ msg: "Data missing", errors: missingData('Current password', 'New password') });
    let result = await Admin.findOne({ where: { id } });
    if (!result) return res.status(404).json({ msg: "Admin not found" });
    bcrypt.compare(old_password, result.password, function(error, success) {
        if (error || !success) return res.status(400).json({ msg: "Wrong password" });
    });
    const hash = await bcrypt.hash(new_password, 10);
    result.password = hash;
    try {
        await result.save();
    } catch (error) {
        return res.status(400).json(error)
    }
    res.status(200).json({ msg: "Password changed" });
};

exports.viewUserInclass = async(req, res) => {
    const { id } = req.params;
    const result = await Course.findOne({
        where: { id },
        include: [{
            model: Client,
            as: "students",
            attributes: ['email'],
            through: {
                attributes: []
            }
        }]
    });
    if (!result) return res.status(404).json({ msg: "No class" })
    res.status(200).json(result)
};

exports.addTimetable = async(req, res) => {
    const { id } = req.params;
    const { week_day, from, to } = req.body;
    if (!week_day || !from || !to) return res.status(400).json({ msg: "Day and Time required" });
    if (!validDay(week_day)) return res.status(400).json({ msg: "Invalid Week day" });
    if (!day(from, 'HH:MM').isValid() || !day(to, 'HH:MM').isValid())
        return res.status(400).json({ msg: "Invalid time format - HH:MM" })
    if (!isRightTime(from, to)) return res.status(400).json({ msg: "End time must be greater than start time" });
    const existTime = await Timetable.findOne({ where: { class_id: id, week_day } });
    if (existTime) return res.status(400).json({ msg: "Day and time occupied" })
    const result = await Course.findByPk(id);
    if (!result) return res.status(404).json({ msg: 'Class not found' });
    try {
        const newTimetable = await Timetable.create({ class_id: id, week_day, from, to })
        res.status(201).json(newTimetable)
    } catch (error) {
        res.status(400).json(error)
    }
};
exports.deleteTime = async(req, res) => {
    const { time_id, class_id } = req.params;
    if (!time_id || !class_id) return res.status(400).json({ msg: 'invalid ID' });
    try {
        const result = Timetable.destroy({ where: { id: time_id, class_id } });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error)
    }
}