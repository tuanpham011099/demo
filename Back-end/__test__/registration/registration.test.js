const app = require('../../index');
const supertest = require('supertest');
const db = require("../../models/index");
const { getAdminToken, getUserToken, getRegis, createData, resetData, resetRegist, getClassId, createRegis, createCourse } = require('../helper/utils');
const { user1, course1 } = require('../helper/mockData');

beforeAll(async() => {
    try {
        await createData(user1, course1)
    } catch (error) {
        console.log(error);
    }
});

afterAll(async() => {
    try {
        await resetData()
    } catch (error) {
        console.log(error);
    }
});


describe('Run registration api', () => {
    let token, id;
    let user_token, user_id;
    // let class_id;
    beforeEach(async() => {
        const admin = await getAdminToken(user1);
        const user = await getUserToken(user1);

        token = admin.token;
        id = admin.id;
        user_token = user.token;
        user_id = user.id;
        await createRegis()
    });


    afterEach(async() => {
        await resetRegist();
    });

    it('should return 200" ', async() => {
        const status = '';
        await supertest(app).get(`/registrations?status=${status}`).expect(200);
    });

    it('should return 400', async() => {
        const class_id = await getClassId();
        console.log(class_id)
        const { statusCode, body } = await supertest(app).post(`/registrations/${class_id}`)
            .set('authorization', `Bearer ${user_token}`);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('msg', 'register success, waiting for admin to approve')
        expect(body).toMatchObject({ 'registration': { 'client_id': 1, "class_id": '1' } })
    });

    it('should return 400', async() => {
        const result = await getRegis('pending');
        const { body, statusCode } = await supertest(app).post(`/registrations/approve/${result.id}`)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', 'No registration with this ID')
    });

    it('should return 200', async() => {
        const result = await getRegis('pending');
        const { statusCode, body } = await supertest(app).post(`/registrations/reject/${result.id}`)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', 'No registration with this ID')
    });

    it('should return 404" ', async() => {
        const result = await getRegis('pending');
        await supertest(app).post(`/registrations/cancel/${result.id}`)
            .set('authorization', `Bearer ${user_token}`).expect(404);
    });
});