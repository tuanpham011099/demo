const supertest = require('supertest');
const app = require('../../index');
const { Admin, Client, Class, Regis, Timetable } = require("../../models");
const bcrypt = require("bcryptjs");

exports.getUserToken = async(data) => {
    const result = await supertest(app).post('/users/login').send(data)
    return {
        id: result.body.id,
        token: result.body.token
    }
};

exports.createData = async(user, course) => {
    try {
        await createAdmin(user);
        await createUser(user);
        await createClass(course);
    } catch (error) {
        return error;
    }
};


exports.resetData = async() => {

    try {
        await Regis.destroy({ where: {}, truncate: true });
        await Timetable.destroy({ where: {}, truncate: true });
        await Admin.destroy({ where: {}, truncate: true });
        await Class.destroy({ where: {}, truncate: true });
    } catch (error) {
        return error;
    }

}

exports.getAdminToken = async(data) => {
    const result = await supertest(app).post('/admins/login').send(data);
    return {
        id: result.body.id,
        token: result.body.token
    }
};

exports.getClassId = async() => {
    const result = await supertest(app).get('/classes');
    return result.body[0].id;
};

const createAdmin = async(data) => {
    try {
        await Admin.create({...data, password: await bcrypt.hash(data.password, 10) });
    } catch (error) {
        return error;
    }
};

const createUser = async(data) => {
    try {
        await Client.create({...data, password: await bcrypt.hash(data.password, 10) });
    } catch (error) {
        return error;
    }
};

exports.userActivation = async(id) => {
    try {
        let result = await Client.findByPk(id);
        await result.update({ is_active: 1 });
        await result.save();
    } catch (error) {
        return error;
    }
};

const createClass = async(data) => {
    try {
        await Class.create(data);
    } catch (error) {
        return error;
    }
};

exports.createRegis = async() => {
    try {
        const client = await Client.findAll();
        const course = await Class.findAll();
        await Regis.create({ client_id: client[0].id, class_id: course[0].id, accept_by: null });
    } catch (error) {
        return error;
    }
};

exports.getRegis = async(status) => {
    try {
        const result = await Regis.findAll();
        return result.body[0];
    } catch (error) {
        return error;
    }
};
exports.resetRegist = async() => {
    try {
        let result = await Regis.findAll({ where: { status: 'accepted' } });
        result[0].status = 'pending';
        await result[0].save();
    } catch (error) {
        return error;
    }
}