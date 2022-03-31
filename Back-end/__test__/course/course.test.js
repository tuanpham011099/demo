const app = require('../../index');
const supertest = require('supertest');
const { course1, user1, course2, course3 } = require('../helper/mockData');
const { getAdminToken, getClassId, createData, resetData } = require('../helper/utils');

beforeAll(async() => {
    await createData(user1, course1);
});

afterAll(async() => {
    try {
        await resetData();
    } catch (error) {
        console.log(error);
    }
})

describe('Run class api', () => {
    let token, id;
    beforeEach(async() => {
        const result = await getAdminToken(user1);
        token = result.token;
        id = result.id;
    })
    it('Run api Get:/classes - return 200', async() => {
        await supertest(app).get(`/classes`)
            .set('authorization', `Bearer ${token}`).expect(200);
    });

    it('Run api Post:/classes - return 401, no token provided', async() => {
        const token = ''
        await supertest(app).post(`/classes`).send(course1)
            .set('authorization', `Bearer ${token}`).expect(401);
    });

    it('Run api Post:/classes - return 400, no name field', async() => {
        const { statusCode, body } = await supertest(app).post(`/classes`).send(course2)
            .set('authorization', `Bearer ${token}`).expect(400);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', 'Data missing')
    });

    it('Run api Post:/classes - return 400, max client lower than 1', async() => {
        const { statusCode, body } = await supertest(app).post(`/classes`).send(course3)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('msg', 'max_client must more than 1')
    });

    it('Run api Post:/classes - return 201, create course success', async() => {
        const { statusCode, body } = await supertest(app).post(`/classes`).send(course1)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(201);
        expect(body).toHaveProperty('msg', 'Course create')
    });

    it('Run api Delete:/classes - return 404, class not found', async() => {
        const class_id = 'asdasd'
        const { statusCode, body } = await supertest(app).delete(`/classes/${class_id}`)
            .set('authorization', `Bearer ${token}`);
        expect(statusCode).toBe(404);
        expect(body).toHaveProperty('msg', 'Class not found');
    })

    it('Run api Delete:classes - return 200, class deleted', async() => {
        const course = await getClassId();
        const { statusCode, body } = await supertest(app).delete(`/classes/${course}`)
            .set('authorization', `Bearer ${token}`)
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('msg', 'Class deleted');
    })
});