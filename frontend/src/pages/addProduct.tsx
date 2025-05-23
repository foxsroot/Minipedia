import React, { useState } from 'react';
import {
  Container, TextField, Typography, Button, Grid, Paper, Box, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

const CreateItem: React.FC = () => {
  const [formData, setFormData] = useState({
    namaBarang: '',
    deskripsiBarang: '',
    stokBarang: '',
    hargaBarang: '',
    kategoriProduk: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, success: false, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        stokBarang: Number(formData.stokBarang),
        hargaBarang: Number(formData.hargaBarang),
      };

      await axios.post('/api/barang', payload); // Adjust the URL if needed
      setSnackbar({ open: true, success: true, message: 'Barang berhasil ditambahkan!' });
      setFormData({
        namaBarang: '',
        deskripsiBarang: '',
        stokBarang: '',
        hargaBarang: '',
        kategoriProduk: '',
      });
    } catch (error: any) {
      setSnackbar({ open: true, success: false, message: 'Gagal menambahkan barang.' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mt: 4, bgcolor: '#fdfdfd' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#03ac0e' }}>
          Tambahkan Produk
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="namaBarang"
                label="Nama Barang"
                fullWidth
                value={formData.namaBarang}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="deskripsiBarang"
                label="Deskripsi Barang"
                fullWidth
                multiline
                rows={3}
                value={formData.deskripsiBarang}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="stokBarang"
                label="Stok Barang"
                fullWidth
                type="number"
                value={formData.stokBarang}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="hargaBarang"
                label="Harga Barang"
                fullWidth
                type="number"
                value={formData.hargaBarang}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="kategoriProduk"
                label="Kategori Produk"
                fullWidth
                value={formData.kategoriProduk}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              background: 'linear-gradient(90deg, #03ac0e 0%, #1abc9c 100%)',
              fontWeight: 'bold',
              color: 'white',
              '&:hover': { background: 'linear-gradient(90deg, #02940c 0%, #16a085 100%)' }
            }}
          >
            Simpan Barang
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.success ? 'success' : 'error'} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateItem;
