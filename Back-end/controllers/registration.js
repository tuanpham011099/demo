const { Registration, Course, Client, Client_class, Admin } = require("../models")
const { registrationMail } = require("../utils/sendMail");

function messageToUser(res, status, message) {
    return res.status(status).json(message);
}

exports.listRegistration = (req, res) => {
    const status = req.query.status || 'pending'
    Registration.findAll({
            where: { status },
            include: [{
                model: Course,
                attributes: ['name', 'description', 'max_client', 'id']
            }, {
                model: Client,
                attributes: ['id', 'email', 'name', 'avatar']
            }, {
                model: Admin,
                attributes: ['id', 'email', 'name', 'avatar']
            }],
            attributes: ['id', 'status', 'accept_by']
        })
        .then(result => messageToUser(res, 200, result))
        .catch(error => messageToUser(res, 400, error));
};

exports.cancelRegistration = async(req, res) => {
    const { registration_id } = req.params;
    const registrationFind = await Registration.findOne({
        where: {
            id: registration_id,
            client_id: req.user.id
        }
    });
    if (!registrationFind) return res.status(404).json({ msg: "Registration not found" })
    if (registrationFind.status === 'approved')
        return messageToUser(res, 406, { msg: "You can't cancel approved registration" });
    try {
        await registrationFind.destroy();
    } catch (error) {
        messageToUser(res, 400, error)
    }
    messageToUser(res, 200, { msg: `${registrationFind.id} has been cancelled` })
}

exports.registerCourse = async(req, res) => {
    const { class_id } = req.params;
    const client_id = req.user.id;
    const result = await Course.findByPk(class_id);
    if (!result) return res.status(400).json({ msg: "Invalid class id" });
    const register = await Registration.findOne({ where: { client_id, class_id, status: 'accepted' } });
    if (register) return res.status(400).json({ msg: "You've already register for this class" });
    const maxStudent = await Course.findOne({
        where: { id: class_id },
        include: [{
            model: Client,
            as: "students"
        }]
    });
    if (maxStudent.max_client === maxStudent.students.length) return res.status(400).json({ msg: "Max student exceeded" })
    try {
        let registration = await Registration.create({ client_id, class_id });
        registrationMail(req.user.email, result.name, registration.id);
        messageToUser(res, 200, { msg: "register success, waiting for admin to approve", registration });
    } catch (error) {
        messageToUser(res, 400, error)
    }
};

exports.courseApproval = async(req, res) => {
    const { registration_id } = req.params;
    if (!registration_id) return messageToUser(res, 400, { msg: "Provide registration ID" });
    const result = await Registration.findByPk(registration_id);
    if (!result) return messageToUser(res, 400, { msg: "No registration with this ID" });
    await Registration.update({
        status: "accepted",
        accept_by: req.user.id
    }, {
        where: { id: registration_id }
    });
    await Client_class.create({
        client_id: result.client_id,
        class_id: result.class_id
    });
    messageToUser(res, 200, { msg: "Registration accepted" });
};

exports.courseReject = async(req, res) => {
    const { registration_id } = req.params;
    if (!registration_id) return messageToUser(res, 400, { msg: "Provide registration ID" });
    const result = await Registration.findByPk(registration_id);
    if (!result) return messageToUser(res, 400, { msg: "No registration with this ID" })
    await Registration.update({
        status: "rejected",
        accept_by: req.user.id
    }, {
        where: {
            id: registration_id
        }
    });
    messageToUser(res, 200, { msg: "Registration rejected" });
};