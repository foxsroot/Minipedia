import request from 'supertest';
import app from '../server';

describe('Barang Endpoints', () => {
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

    let createdBarangId: number;
    const barangData = {
        namaBarang: 'Test Barang',
        hargaBarang: 10000,
        stokBarang: 10,
        deskripsiBarang: 'Barang untuk testing',
        kategoriProduk: "FASHION",
        fotoBarang: 'image.jpg',
    };

    it('should create a new barang', async () => {
        const response = await request(app)
            .post('/api/barang')
            .set('Authorization', `Bearer ${token}`)
            .send(barangData);
        expect([200, 201]).toContain(response.status);
        expect(response.body.namaBarang).toBe(barangData.namaBarang);
        createdBarangId = response.body.barangId;
    });

    it('should retrieve a barang by id', async () => {
        const response = await request(app)
            .get(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.barangId).toBe(createdBarangId);
    });

    it('should update a barang', async () => {
        const response = await request(app)
            .put(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ namaBarang: 'Updated Barangggggg', hargaBarang: 200000 });
        expect(response.status).toBe(200);
        expect(response.body.namaBarang).toBe('Updated Barangggggg');
    });

    it('should delete a barang', async () => {
        const response = await request(app).
            delete(`/api/barang/${createdBarangId}`)
            .set('Authorization', `Bearer ${token}`);
        expect([200, 204]).toContain(response.status);
    });
});