import request from 'supertest';
import app from '../server';

describe('Barang Endpoints', () => {
    let token: string;
    let createdBarangId: string;

    // Dummy user for login (harus punya toko)
    const userData = {
        username: 'barang_testuser',
        password: 'testpass123',
        email: 'barang_testuse12r@example.com',
        nama: 'Barang Test User',
        nomorTelpon: '08123456789'
    };

    const tokoData = {
        namaToko: 'Toko Barang Test 90211',
        lokasiToko: 'Jl. Test'
    };

    const barangData = {
        namaBarang: 'Test Barang 81129',
        hargaBarang: 10000,
        stokBarang: 10,
        deskripsiBarang: 'Barang untuk testing',
        kategoriProduk: "FASHION",
        diskonProduk: 15,
    };

    beforeAll(async () => {
        // Register & login user
        try { await request(app).post('/api/auth/register').send(userData); } catch { }
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });
        token = loginRes.body.token;

        // Buat toko jika belum ada
        try {
            const tokoRes = await request(app)
                .post('/api/toko')
                .set('Authorization', `Bearer ${token}`)
                .send(tokoData);
            if (tokoRes.body && tokoRes.body.token) token = tokoRes.body.token;
        } catch { }

    });

    afterAll(async () => {
        // Clean up: delete user (soft delete)
        if (token) {
            await request(app)
                .delete('/api/user')
                .set('Authorization', `Bearer ${token}`);
        }
    });

    describe('POST /api/barang', () => {
        it('should fail to create barang with missing required fields', async () => {
            const response = await request(app)
                .post('/api/barang')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect([400, 401, 500]).toContain(response.status);
        });

        it('should create a new barang', async () => {
            const response = await request(app)
                .post('/api/barang')
                .set('Authorization', `Bearer ${token}`)
                .field('namaBarang', barangData.namaBarang)
                .field('hargaBarang', barangData.hargaBarang)
                .field('stokBarang', barangData.stokBarang)
                .field('deskripsiBarang', barangData.deskripsiBarang)
                .field('kategoriProduk', barangData.kategoriProduk)
                .field('diskonProduk', barangData.diskonProduk)
                .attach('image', Buffer.from('test'), 'image.jpg');
            expect([200, 201]).toContain(response.status);
            expect(response.body).toHaveProperty('namaBarang', barangData.namaBarang);
            expect(response.body).toHaveProperty('hargaBarang', barangData.hargaBarang);
            expect(response.body).toHaveProperty('stokBarang', barangData.stokBarang);
            expect(response.body).toHaveProperty('deskripsiBarang', barangData.deskripsiBarang);
            expect(response.body).toHaveProperty('kategoriProduk', barangData.kategoriProduk);
            expect(response.body).toHaveProperty('fotoBarang');
            expect(response.body).toHaveProperty('diskonProduk', barangData.diskonProduk);
            createdBarangId = response.body.barangId;
        });
    });

    describe('GET /api/barang/:id', () => {
        it('should retrieve a barang by id', async () => {
            const response = await request(app)
                .get(`/api/barang/${createdBarangId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('barangId', createdBarangId);
            expect(response.body).toHaveProperty('namaBarang', barangData.namaBarang);
            expect(response.body).toHaveProperty('hargaBarang', barangData.hargaBarang);
            expect(response.body).toHaveProperty('stokBarang', barangData.stokBarang);
            expect(response.body).toHaveProperty('deskripsiBarang', barangData.deskripsiBarang);
            expect(response.body).toHaveProperty('kategoriProduk', barangData.kategoriProduk);
            expect(response.body).toHaveProperty('fotoBarang');
            expect(response.body).toHaveProperty('diskonProduk', barangData.diskonProduk);
        });

        it('should fail to get a deleted barang', async () => {
            // Delete first
            await request(app)
                .delete(`/api/barang/${createdBarangId}`)
                .set('Authorization', `Bearer ${token}`);
            const response = await request(app)
                .get(`/api/barang/${createdBarangId}`)
                .set('Authorization', `Bearer ${token}`);
            expect([400, 404, 500]).toContain(response.status);
        });
    });

    describe('PUT /api/barang/:id', () => {
        let updateBarangId: string;

        beforeAll(async () => {
            // Buat barang baru untuk update test
            const response = await request(app)
                .post('/api/barang')
                .set('Authorization', `Bearer ${token}`)
                .field('namaBarang', 'Barang Update')
                .field('hargaBarang', 20000)
                .field('stokBarang', 5)
                .field('deskripsiBarang', 'Deskripsi update')
                .field('kategoriProduk', 'ELECTRONICS')
                .field('diskonProduk', 25)
                .attach('image', Buffer.from('test'), 'image.jpg');
            updateBarangId = response.body.barangId;
        });

        it('should update a barang', async () => {
            const updateData = {
                namaBarang: 'Updated Barang',
                hargaBarang: 200000,
                stokBarang: 5,
                deskripsiBarang: 'Updated deskripsi',
                kategoriProduk: 'ELECTRONICS',
                diskonProduk: 25,
            };
            const response = await request(app)
                .put(`/api/barang/${updateBarangId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('namaBarang', updateData.namaBarang);
            expect(response.body).toHaveProperty('hargaBarang', updateData.hargaBarang);
            expect(response.body).toHaveProperty('stokBarang', updateData.stokBarang);
            expect(response.body).toHaveProperty('deskripsiBarang', updateData.deskripsiBarang);
            expect(response.body).toHaveProperty('kategoriProduk', updateData.kategoriProduk);
            expect(response.body).toHaveProperty('diskonProduk', updateData.diskonProduk);
        });

        it('should fail to update a barang with invalid data', async () => {
            const response = await request(app)
                .put(`/api/barang/${updateBarangId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ hargaBarang: -100 });
            expect([400, 403, 404, 500]).toContain(response.status);
        });
    });

    describe('DELETE /api/barang/:id', () => {
        let deleteBarangId: string;

        beforeAll(async () => {
            // Buat barang baru untuk delete test
            const response = await request(app)
                .post('/api/barang')
                .set('Authorization', `Bearer ${token}`)
                .field('namaBarang', 'Barang Update')
                .field('hargaBarang', 20000)
                .field('stokBarang', 5)
                .field('deskripsiBarang', 'Deskripsi update')
                .field('kategoriProduk', 'ELECTRONICS')
                .field('diskonProduk', 25)
                .attach('image', Buffer.from('test'), 'image.jpg');
            deleteBarangId = response.body.barangId;
        });

        it('should delete a barang', async () => {
            const response = await request(app)
                .delete(`/api/barang/${deleteBarangId}`)
                .set('Authorization', `Bearer ${token}`);
            expect([200, 204]).toContain(response.status);
        });

        it('should fail to get a deleted barang', async () => {
            const response = await request(app)
                .get(`/api/barang/${deleteBarangId}`)
                .set('Authorization', `Bearer ${token}`);
            expect([400, 404, 500]).toContain(response.status);
        });
    });
});