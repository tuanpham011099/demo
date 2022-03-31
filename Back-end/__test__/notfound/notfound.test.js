const app = require('../../index');
const supertest = require('supertest');
const API = '/asdasdasd'

describe('Run notfound api', () => {
    it('should return 404', async() => {
        const { statusCode, body } = await supertest(app).get(API);
        expect(statusCode).toBe(404);
        expect(body).toHaveProperty('msg');
    });

    it('should return 404', async() => {
        const { statusCode, body } = await supertest(app).post(API);
        expect(statusCode).toBe(404);
        expect(body).toHaveProperty('msg');
    });
});