/* eslint-disable */
const app = require('../../index');
const supertest = require('supertest');
const { user1, user2, updateUser1, course1, user3, timetable1, user5, user4, user8 } = require("../helper/mockData");
const { getAdminToken, getClassId, createData, resetData } = require("../helper/utils");


beforeAll(async() => {
    try {
        await createData(user1, course1);
    } catch (error) {
        console.log(error);
    }
})

afterAll(async() => {
    try {
        await resetData();
    } catch (error) {
        console.log(error);
    }
})


describe('Run admin api', () => {
    let token, id;
    beforeEach(async() => {
        const res = await getAdminToken(user1);
        token = res.token;
        id = res.id;
    });

    it('Run api Post:/admins/', async() => {
        await supertest(app).post(`/admins/`)
            .send(user2)
            .expect(400);
    });

    it('Run api Get:/admins/:id, should return 401', async() => {
        const token = '';
        await supertest(app).get(`/admins/${1}`)
            .set('authorization', `Bearer ${token}`)
            .expect(401);
    });

    it('Run api Put:/admins/update/:id - No name provide', async() => {
        const { statusCode, body } = await supertest(app).put(`/admins/update/${id}`)
            .send(user2)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', "Data missing");
        expect(body).toHaveProperty('errors', { id: 'required', name: 'required', email: 'required' });
    });

    it('Run api Put:/admins/update/:id - No email provide', async() => {
        const { statusCode, body } = await supertest(app).put(`/admins/update/${id}`)
            .send(user3)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', 'Data missing');
        expect(body).toHaveProperty('errors', { id: 'required', email: 'required', name: 'required' });
    });

    it('Run api Put:/admins/update/:id - Should return status 200', async() => {
        const { statusCode, body } = await supertest(app).put(`/admins/update/${id}`)
            .send(user1)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(200);
        expect(body).toMatchObject({ 'admin': user8, "msg": "Admin updated" });
    });

    it('Run api Patch:/admins/change-password/:d - Data missing', async() => {
        const { statusCode, body } = await supertest(app).patch(`/admins/change-password/dasda`)
            .send({})
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', 'Data missing');
        expect(body).toHaveProperty('errors', { 'Current password': 'required', 'New password': 'required' });
    });

    it('Run api Patch:/admins/change-password/:id - should return status 200', async() => {
        const { body, statusCode } = await supertest(app).patch(`/admins/change-password/${id}`)
            .send(updateUser1)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(200)
        expect(body).toHaveProperty('msg', "Password changed")
    });

    it('Run api Get:/admins/class/:id - No token provide', async() => {
        const token = ''
        await supertest(app).get(`/admins/class/${1}`)
            .set('authorization', `Bearer ${token}`).expect(401);
    });

    it('Run api Post:/admins/:class_id/timetable - No token provide', async() => {
        const token = '';
        await supertest(app).post(`/admins/${1}/timetable`)
            .send(timetable1)
            .set('authorization', `Bearer ${token}`).expect(401)
    })

    it('Run api Post:/admins/:class_id/timetable - Wrong admin login', async() => {
        const { token } = getAdminToken(user4)
        const { statusCode, body } = await supertest(app).post(`/admins/${1}/timetable`)
            .send(timetable1)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(403);
        expect(body).toHaveProperty('error')
    })

    it('Run api /admins/:class_id/timetable', async() => {
        const { token, id } = getAdminToken(user5)
        const { statusCode, body } = await supertest(app).post(`/admins/${1}/timetable`)
            .send(timetable1)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(403);
    })
});