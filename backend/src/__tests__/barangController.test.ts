import request from 'supertest';
import app from '../server';

describe('Barang Endpoints', () => {
    let token: string;
    let createdBarangId: string;
    const userData = {
        password: 'testpass',
        email: 'testuser@example.com',
    };
    const barangData = {
        namaBarang: 'Test Barang',
        hargaBarang: 10000,
        stokBarang: 10,
        deskripsiBarang: 'Barang untuk testing',
        kategoriProduk: "FASHION",
        fotoBarang: 'image.jpg',
        diskonProduk: 15,
    };

    beforeAll(async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });
        token = loginRes.body.token;
    });

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
        expect(response.body.namaBarang).toBe(barangData.namaBarang);
        expect(response.body.hargaBarang).toBe(barangData.hargaBarang);
        expect(response.body.stokBarang).toBe(barangData.stokBarang);
        expect(response.body.deskripsiBarang).toBe(barangData.deskripsiBarang);
        expect(response.body.kategoriProduk).toBe(barangData.kategoriProduk);
        expect(response.body.fotoBarang).toBeDefined();
        expect(response.body.diskonProduk).toBe(barangData.diskonProduk);
        createdBarangId = response.body.barangId;
    });

    it('should retrieve a barang by id', async () => {
        const response = await request(app)
            .get(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.barangId).toBe(createdBarangId);
        expect(response.body.namaBarang).toBe(barangData.namaBarang);
        expect(response.body.hargaBarang).toBe(barangData.hargaBarang);
        expect(response.body.stokBarang).toBe(barangData.stokBarang);
        expect(response.body.deskripsiBarang).toBe(barangData.deskripsiBarang);
        expect(response.body.kategoriProduk).toBe(barangData.kategoriProduk);
        expect(response.body.fotoBarang).toBeDefined();
        expect(response.body.diskonProduk).toBe(barangData.diskonProduk);
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
            .put(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);
        expect(response.status).toBe(200);
        expect(response.body.namaBarang).toBe(updateData.namaBarang);
        expect(response.body.hargaBarang).toBe(updateData.hargaBarang);
        expect(response.body.stokBarang).toBe(updateData.stokBarang);
        expect(response.body.deskripsiBarang).toBe(updateData.deskripsiBarang);
        expect(response.body.kategoriProduk).toBe(updateData.kategoriProduk);
        expect(response.body.diskonProduk).toBe(updateData.diskonProduk);
    });

    it('should fail to update a barang with invalid data', async () => {
        const response = await request(app)
            .put(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ hargaBarang: -100 });
        expect([400, 403, 404, 500]).toContain(response.status);
    });

    it('should delete a barang', async () => {
        const response = await request(app)
            .delete(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`);
        expect([200, 204]).toContain(response.status);
    });

    it('should fail to get a deleted barang', async () => {
        const response = await request(app)
            .get(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`);
        expect([400, 404, 500]).toContain(response.status);
    });
});