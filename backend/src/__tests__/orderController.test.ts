import request from 'supertest';
import app from '../server';

describe('Order Endpoints', () => {
    let token: string;

    const userData = {
        password: 'testpass',
        email: 'testuser@example.com',
    };

    beforeAll(async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });
        token = loginRes.body.token;
    });

    let createdOrderId: number;
    const orderData = {
        orderItems: [
            { barangId: "b9d8b3df-3498-4a5d-9174-f2df32c48b4e", quantity: 2 }
        ],
        alamatPengiriman: 'Test Address',
        nomorTelpon: '08123456789',
        pengiriman: "standard",
        namaPenerima: "KOCAKKK",
    };

    it('should create a new order', async () => {
        const response = await request(app)
            .post('/api/order')
            .set('Authorization', `Bearer ${token}`)
            .send(orderData);
        console.log('RESPONSE:', response.body);
        expect([200, 201]).toContain(response.status);
        expect(response.body).toHaveProperty('orderId');
        createdOrderId = response.body.orderId;
    });

    it('should retrieve an order by id', async () => {
        const response = await request(app)
            .get(`/api/order/${createdOrderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.orderId).toBe(createdOrderId);
    });

    it('should update an order', async () => {
        const response = await request(app)
            .put(`/api/order/${createdOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ statusPengiriman: "PACKED" });
        console.log('RESPONSE:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.statusPengiriman).toBe("PACKED");
    });

    it('should delete an order', async () => {
        const response = await request(app)
            .delete(`/api/order/${createdOrderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect([200, 204]).toContain(response.status);
    });
});