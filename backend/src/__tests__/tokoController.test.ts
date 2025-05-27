import request from 'supertest';
import app from '../server';

describe('Toko Endpoints', () => {
    let token: string;
    const userData = {
        password: '123',
        email: 'luis@luis.com',
    };

    beforeAll(async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });
        token = loginRes.body.token;
    });

    const tokoData = {
        namaToko: 'Test Toko 5',
        lokasiToko: 'Test Address 4',
    };

    it('should create a new toko', async () => {
        const response = await request(app)
            .post('/api/toko')
            .set('Authorization', `Bearer ${token}`)
            .send(tokoData);

        console.log('Response:', response.body);
        expect([200, 201]).toContain(response.status);
        expect(response.body).toHaveProperty('toko');
        expect(response.body.toko.namaToko).toBe(tokoData.namaToko);
    });

    async function loginUserAgain() {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });
        token = loginRes.body.token;
    }

    loginUserAgain();

    // it('should retrieve a toko by id', async () => {
    //     const response = await request(app).get(`/api/toko/${createdTokoId}`);
    //     expect(response.status).toBe(200);
    //     expect(response.body.id).toBe(createdTokoId);
    // });

    it('should update a toko', async () => {
        const response = await request(app)
            .put(`/api/toko`)
            .set('Authorization', `Bearer ${token}`)
            .send({ namaToko: 'Updated Toko 2', alamatToko: 'Updated Address' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('toko');
        expect(response.body.toko.namaToko).toBe('Updated Toko 2');
    });

    // it('should delete a toko', async () => {
    //     const response = await request(app)
    //         .delete(`/api/toko/`)
    //         .set('Authorization', `Bearer ${token}`);
    //     expect([200, 204]).toContain(response.status);
    //     expect(response.body.message).toBe("Toko deleted successfully");
    // });
});