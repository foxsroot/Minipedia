import request from 'supertest';
import app from '../server';

describe('Order Endpoints', () => {
    let userToken: string;
    let tokoOwnerToken: string;
    let createdOrderId: string;
    let validBarangId: string;
    const invalidOrderId = "11111111-2222-3333-4444-555555555555";

    // Setup test data
    const userData = {
        username: 'AJG',
        password: '123',
        email: 'ajg@ajg.com',
        nama: 'AJG',
        nomorTelpon: '123123'
    };

    const tokoOwnerData = {
        username: 'AJGG',
        password: '1234',
        email: 'ajgg@ajgg.com',
        nama: 'AJGG',
        nomorTelpon: '123123123'
    };

    beforeAll(async () => {
        // Register and login user
        try { await request(app).post('/api/auth/register').send(userData); } catch {}
        const userLoginRes = await request(app).post('/api/auth/login').send({ email: userData.email, password: userData.password });
        userToken = userLoginRes.body.token;
        console.log('User token:', userToken);

        // Register and login toko owner
        try { await request(app).post('/api/auth/register').send(tokoOwnerData); } catch {}
        let tokoOwnerLoginRes = await request(app).post('/api/auth/login').send({ email: tokoOwnerData.email, password: tokoOwnerData.password });
        tokoOwnerToken = tokoOwnerLoginRes.body.token;
        console.log('Toko Owner token:', tokoOwnerToken);

        // Create toko for toko owner
        try {
            const tokoRes = await request(app)
                .post('/api/toko')
                .set('Authorization', `Bearer ${tokoOwnerToken}`)
                .send({ namaToko: 'OrderTestToko', lokasiToko: 'OrderTestLokasi' });
            if (tokoRes.body && tokoRes.body.token) tokoOwnerToken = tokoRes.body.token;
        } catch {}

        // Create barang for toko owner
        const barangRes = await request(app)
            .post('/api/barang')
            .set('Authorization', `Bearer ${tokoOwnerToken}`)
            .send({
                namaBarang: 'OrderTestBarang',
                hargaBarang: 10000,
                stokBarang: 50,
                deskripsiBarang: 'Barang untuk order test'
            });
        validBarangId = barangRes.body.barangId;
    });

    afterAll(async () => {
        // Clean up: delete user and toko owner (soft delete)
        // try { await request(app).delete('/api/user').set('Authorization', `Bearer ${userToken}`); } catch {}
        // try { await request(app).delete('/api/user').set('Authorization', `Bearer ${tokoOwnerToken}`); } catch {}
    });

    describe('POST /api/order', () => {
        it('should return 401 without token', async () => {
            const response = await request(app).post('/api/order').send({});
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 400 with empty order items', async () => {
            const response = await request(app)
                .post('/api/order')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    orderItems: [],
                    alamatPengiriman: 'Test Address',
                    nomorTelpon: '08123456789',
                    pengiriman: "SICEPAT",
                    namaPenerima: "Test Receiver",
                });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Order must contain at least one order item');
        });

        it('should create a new order with valid data', async () => {
            console.log('Valid Barang ID:', validBarangId);
            const orderData = {
                orderItems: [
                    { barangId: "4ce05a64-ab48-4fe7-a8f4-fce27fd873ed", quantity: 2, hargaBarang: 10000 }
                ],
                alamatPengiriman: 'Test Address',
                nomorTelpon: '08123456789',
                pengiriman: "SICEPAT",
                namaPenerima: "Test Receiver",
            };
            console.log('User Token:', userToken);
            const response = await request(app)
                .post('/api/order')
                .set('Authorization', `Bearer ${userToken}`)
                .send(orderData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('orderId');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('orderItems');
            createdOrderId = response.body.orderId;
        });
    });

    describe('GET /api/order/:id', () => {
        it('should return 401 without token', async () => {
            const response = await request(app).get(`/api/order/${createdOrderId}`);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 404 for non-existent order', async () => {
            const response = await request(app)
                .get(`/api/order/${invalidOrderId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Order not found');
        });

        it('should retrieve an order by id', async () => {
            const response = await request(app)
                .get(`/api/order/${createdOrderId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('orderId', createdOrderId);
            expect(response.body).toHaveProperty('orderItems');
        });
    });

    describe('GET /api/order', () => {
        it('should return 401 without token', async () => {
            const response = await request(app).get('/api/order');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should retrieve all orders for current user', async () => {
            const response = await request(app)
                .get('/api/order')
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            const foundOrder = response.body.find((o: any) => o.orderId === createdOrderId);
            expect(foundOrder).toBeDefined();
        });
    });

    describe('PUT /api/order/:orderId/update-status', () => {
        it('should return 401 without token', async () => {
            const response = await request(app)
                .put(`/api/order/${createdOrderId}/update-status`)
                .send({ statusPengiriman: 'SHIPPED' });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 404 for non-existent order', async () => {
            const response = await request(app)
                .put(`/api/order/${invalidOrderId}/update-status`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ statusPengiriman: 'SHIPPED' });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Order not found');
        });

        it('should update order shipping status and generate nomor resi', async () => {
            const response = await request(app)
                .put(`/api/order/${createdOrderId}/update-status`)
                .set('Authorization', `Bearer ${tokoOwnerToken}`)
                .send({ statusPengiriman: 'SHIPPED' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Order status updated');
            expect(response.body).toHaveProperty('nomorResi');
        });
    });

    describe('DELETE /api/order/:id', () => {
        it('should return 401 without token', async () => {
            const response = await request(app)
                .delete(`/api/order/${createdOrderId}`);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 404 for non-existent order', async () => {
            const response = await request(app)
                .delete(`/api/order/${invalidOrderId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Order not found');
        });

        it('should cancel the order (soft delete by statusPesanan)', async () => {
            const orderData = {
                orderItems: [
                    { barangId: "4ce05a64-ab48-4fe7-a8f4-fce27fd873ed", quantity: 2, hargaBarang: 10000 }
                ],
                alamatPengiriman: 'Test Address',
                nomorTelpon: '08123456789',
                pengiriman: "SICEPAT",
                namaPenerima: "Test Receiver",
            };
            console.log('User Token:', userToken);
            const response = await request(app)
                .post('/api/order')
                .set('Authorization', `Bearer ${userToken}`)
                .send(orderData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('orderId');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('orderItems');
            createdOrderId = response.body.orderId;
            const response2 = await request(app)
                .delete(`/api/order/${createdOrderId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response2.status).toBe(200);
            expect(response2.body).toHaveProperty('message', 'Order canceled successfully');

            // Check order statusPesanan is CANCELED (soft delete)
            const checkResponse = await request(app)
                .get(`/api/order/${createdOrderId}`)
                .set('Authorization', `Bearer ${tokoOwnerToken}`);
            expect(checkResponse.status).toBe(200);
            expect(checkResponse.body).toHaveProperty('statusPesanan', 'CANCELED');
        });
    });
});