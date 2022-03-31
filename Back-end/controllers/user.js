const randomstring = require("randomstring");
const uploadImg = require("../utils/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Client, Course, Timetable } = require("../models");
const { verifyMail } = require("../utils/sendMail");
const { missingData, validateEmail } = require("../utils/dataError");

function messageToUser(res, status, message) {
    return res.status(status).json(message);
}

exports.createUser = async(req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ msg: "Data missing", errors: missingData('password', 'name', 'email') });
    }
    if (!validateEmail(email)) return res.status(400).json({ msg: 'Wrong email format' });
    const result = await Client.findOne({ where: { email } });
    if (result) return res.status(400).json({ msg: "User already exist" });
    let avatar = null;
    if (req.file) {
        avatar = await uploadImg(req.file.path);
    }
    const token = randomstring.generate();
    const hash = await bcrypt.hash(password, 10);
    const newUser = await Client.create({ name, password: hash, avatar, email, token });
    try {
        await verifyMail(email, newUser.token);
    } catch (error) {
        messageToUser(res, 400, error)
    }
    messageToUser(res, 200, { msg: `${newUser.email} created, go to your mail to verify account` });
};

exports.login = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Data missing", errors: missingData('email', 'password') });
    await Client.findOne({ where: { email }, attributes: { exclude: ['token'] } })
        .then(result => {
            if (!result) return res.status(404).json({ msg: "wrong email" });
            bcrypt.compare(password, result.password, (error, success) => {
                if (!success || error) return res.status(400).json({ msg: 'Invalid password' })
                const token = jwt.sign({ email: result.email, id: result.id, admin: false }, process.env.SECRET, { expiresIn: '24h' });
                messageToUser(res, 200, { id: result.id, email: result.email, name: result.name, avatar: result.avatar, is_active: result.is_active, token });
            })
        })
        .catch(error => messageToUser(res, 400, error))
};
exports.profile = async(req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "Provide id" });
    Client.findByPk(id, { attributes: { exclude: ['password', 'token'] } })
        .then(result => messageToUser(res, 200, result))
        .catch(error => messageToUser(res, 400, error));
};
exports.listRegistedClasses = async(req, res) => {
    const result = await Client.findOne({
        where: { id: req.user.id },
        include: [{
            model: Course,
            as: 'classes',
            attributes: ['id', 'name', 'description'],
            include: [{
                model: Timetable,
                as: 'timetable',
                attributes: ['week_day', 'from', 'to']
            }]
        }],
        attributes: {
            exclude: ['token', 'password']
        }
    });
    if (!result.classes) return messageToUser(res, 404, { msg: "You've not yet registered to any class" })
    messageToUser(res, 200, result)
}

exports.verifyMail = async(req, res) => {
    const { token } = req.params;
    if (!token)
        return messageToUser(res, 400, { msg: "No token provide" });
    let result = await Client.findOne({ where: { token } });
    if (!result)
        return messageToUser(res, 400, { msg: "User not found" });
    result.set({ is_active: true, token: null });
    try {
        await result.save();
    } catch (error) {
        return messageToUser(res, 400, error)
    }
    messageToUser(res, 200, { msg: "User verified" })
};

exports.updateUser = async(req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;
    if (!id || !email || !name) return messageToUser(res, 400, { msg: "Data missing", errors: missingData('id', 'email', 'name') })
    let result = await Client.findByPk(id, {
        attributes: { exclude: ['token', 'password'] }
    });
    if (!result || !result.is_active)
        return res.status(404).json({ msg: "User not found or not active yet" });
    result.name = name;
    if (req.file) {
        let avatar = await uploadImg(req.file.path);
        result.avatar = avatar;
    }
    let existMail = await Client.findOne({ where: { email } });
    if (result.email !== email && !existMail) {
        result.email = email;
    }
    try {
        await result.save();
    } catch (error) {
        messageToUser(res, 400, error)
    }
    messageToUser(res, 200, { msg: "User updated", user: result })
};

exports.changePassword = async(req, res) => {
    const { id } = req.params;
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) return messageToUser(res, 400, { msg: "old and new password required" })
    let result = await Client.findByPk(id);
    if (!result || !result.is_active)
        return res.status(404).json({ msg: "User not found or not active yet" });
    bcrypt.compare(old_password, result.password, function(error) {
        if (error) return messageToUser(res, 400, { msg: "Wrong password" })
    });
    const hash = await bcrypt.hash(new_password, 10);
    result.password = hash;
    try {
        await result.save();
    } catch (error) {
        return messageToUser(res, 400, error)
    }
    messageToUser(res, 200, { msg: "Password changed" })
};