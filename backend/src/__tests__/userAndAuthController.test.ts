import request from 'supertest';
import app from '../server';

let token: string;
const userData = {
    username: 'testuser',
    password: 'testpass',
    email: 'testuser@example.com',
    nama: 'Test User',
    nomorTelpon: '08123456789'
};

describe('User & Authentication Endpoints', () => {
    beforeAll(async () => {
        // Register user
        await request(app)
            .post('/api/auth/register')
            .send(userData);
        // Login user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });
        token = loginRes.body.token;
    });

    it('should not register a user with missing username or password', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: '', password: '' });
        expect(response.status).toBe(400);
    });

    it('should login a user with valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('token');
    });

    it('should not login a user with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'wronguser@example.com', password: 'wrongpass' });
        expect([400, 401]).toContain(response.status);
    });

    it('should get the current user', async () => {
        const response = await request(app)
            .get('/api/user/me')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(userData.email);
    });

    it('should update the current user', async () => {
        const response = await request(app)
            .put('/api/user')
            .set('Authorization', `Bearer ${token}`)
            .send({ nama: 'Updated User', nomorTelpon: '08123456780' });
        expect(response.status).toBe(200);
        expect(response.body.nama).toBe('Updated User');
    });

    it('should delete the current user', async () => {
        const response = await request(app)
            .delete('/api/user')
            .set('Authorization', `Bearer ${token}`);
        expect([200, 204]).toContain(response.status);
    });
});
