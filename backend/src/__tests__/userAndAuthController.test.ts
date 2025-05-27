import request from 'supertest';
import app from '../server';

describe('Authentication Controller', () => {
    const userData = {
        username: 'auth_testuser',
        password: 'testpass123',
        email: 'auth_testuser55@example.com',
        nama: 'Auth Test User',
        nomorTelpon: '08123456789'
    };

    let token: string;

    afterAll(async () => {
        // Clean up: delete user (soft delete)
        if (token) {
            await request(app)
                .delete('/api/user')
                .set('Authorization', `Bearer ${token}`);
        }
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);
            expect([200, 201]).toContain(res.status);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('userId');
        });

        it('should not register with existing email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);
            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty('message', 'Email already registered');
        });

        it('should not register with missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: '', password: '' });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: userData.email, password: userData.password });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Login successful');
            expect(res.body).toHaveProperty('token');
            token = res.body.token;
        });

        it('should not login with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: userData.email, password: 'wrongpass' });
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message');
        });

        it('should not login with missing credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        it('should not login with non-existent email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'notfound@example.com', password: 'testpass123' });
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logout successful');
        });

        it('should not logout with missing token', async () => {
            const res = await request(app)
                .post('/api/auth/logout');
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        it('should not logout with already blacklisted token', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });
});