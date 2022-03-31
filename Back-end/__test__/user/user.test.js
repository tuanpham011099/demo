/* eslint-disable */
const app = require('../../index');
const supertest = require('supertest');
const { user2, user1, course1, user4, updateUser1, regis1, user6, user7 } = require("../helper/mockData");
const { getUserToken, userActivation, createData, resetData } = require("../helper/utils");

beforeAll(async() => {
    try {
        await createData(user1, course1, regis1)
    } catch (error) {
        console.log(error);
    }
})

afterAll(async() => {
    try {
        await resetData()
    } catch (error) {
        console.log(error);
    }
})


describe('Run user api', () => {
    let token, user_id;
    beforeAll(async() => {
        const result = await getUserToken(user1);
        token = result.token;
        user_id = result.id;
    })

    it('Run api Get:/users/:id - No token provided', async() => {
        const token = '';
        const { statusCode, body } = await supertest(app).get(`/users/${1}`)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(401)
        expect(body).toHaveProperty('msg', "Not allow")
    });

    it('Run api Get:/users/verify/:token - should return 401', async() => {
        const token = ''
        const { statusCode } = await supertest(app).get(`/users/verify/${token}`)
        expect(statusCode).toBe(401);
    });

    it('Run api Put:/users/update/ - No "name" provided', async() => {
        const { statusCode, body } = await supertest(app)
            .put(`/users/update/asdasd`)
            .send(user6)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', "Data missing")
        expect(body).toHaveProperty('errors', { id: 'required', name: 'required', email: 'required' })
    });

    it('Run api Put:/users/update/ - No "name" provided', async() => {
        const { statusCode, body } = await supertest(app)
            .put(`/users/update/asdasd`)
            .send(user7)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(404);
        expect(body).toHaveProperty('msg', "User not found or not active yet")
    });

    it('Run api Put:/users/update/:id - No data provided', async() => {
        const { statusCode, body } = await supertest(app).put(`/users/update/${user_id}`)
            .send(user2)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', "Data missing")
        expect(body).toHaveProperty('errors', { name: 'required', id: 'required', email: 'required' })
    });

    it('Run api Put:/users/update/:id - update user', async() => {
        await userActivation(user_id);
        const { statusCode, body } = await supertest(app).put(`/users/update/${user_id}`).send(user4)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('msg', "User updated")
        expect(body).toHaveProperty('user', {...user4, is_active: true, id: 1 })
    });

    it('Run api Patch:/users/change-password/:id', async() => {
        const { statusCode, body } = await supertest(app).patch(`/users/change-password/${user_id}`)
            .send({})
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', "old and new password required");
    });

    it('Run api Patch:/users/change-password/:id ', async() => {
        const { statusCode, body } = await supertest(app).patch(`/users/change-password/${user_id}`)
            .send(updateUser1)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('msg', 'Password changed')
    });

    it('Run api Get:/users/:id/registered-class - No token provided', async() => {
        const token = ''
        const { statusCode, body } = await supertest(app).get(`/users/${user_id}/registered-class`)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(401);
        expect(body).toHaveProperty('msg');
    });

    it('Run api Get:/users/:id/registered-class', async() => {
        const { statusCode, body } = await supertest(app).get(`/users/${user_id}/registered-class`)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(200);
    });

});