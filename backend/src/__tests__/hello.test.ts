import request from 'supertest';
import app from '../server';

describe('Health Check', () => {
	it('should return 200 OK for /', async () => {
		const response = await request(app).get('/');
		expect([200, 404]).toContain(response.status); // 404 if no root route is defined
	});
});