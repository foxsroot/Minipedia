import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Typography, Button, Grid, Paper, Box, Snackbar, Alert
} from '@mui/material';

import NavigationBar from '../components/NavigationBar';
import SellerSidebar from '../components/SellerSidebar';

const CreateItem: React.FC = () => {
  const [formData, setFormData] = useState({
    namaBarang: '',
    deskripsiBarang: '',
    stokBarang: '',
    hargaBarang: '',
    kategoriProduk: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, success: false, message: '' });
  const navigate = useNavigate();

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

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/barang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        navigate("/auth/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Gagal menambahkan barang.");
      }else{
        setSnackbar({ open: true, success: true, message: 'Barang berhasil ditambahkan!' });
        setFormData({
        namaBarang: '',
        deskripsiBarang: '',
        stokBarang: '',
        hargaBarang: '',
        kategoriProduk: '',
        });
         
        setTimeout(() => {
          navigate("/manage-product");
        }, 1000); 
      }

    } catch (error: any) {
      setSnackbar({ open: true, success: false, message: error.message || 'Terjadi kesalahan.' });
    }
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ display: 'flex' }}>
        <SellerSidebar />
        <main style={{ flex: 1, padding: '2rem' }}>
          <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Grid item>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#03ac0e' }}>
                Tambahkan Produk
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate('/manage-product')}
                sx={{
                  borderColor: '#03ac0e',
                  color: '#03ac0e',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#e8f5e9',
                    borderColor: '#02940c',
                  }
                }}
              >
                Kembali
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={4} sx={{ p: 4, mt: 4, borderRadius: 4, bgcolor: '#fdfdfd' }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2} direction="column">
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

                {/* Grouped row for stok, harga, and kategori */}
                <Grid item container spacing={2} xs={12}>
                  <Grid item xs={4}>
                    <TextField
                      name="stokBarang"
                      label="Stok"
                      type="number"
                      fullWidth
                      value={formData.stokBarang}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      name="hargaBarang"
                      label="Harga"
                      type="number"
                      fullWidth
                      value={formData.hargaBarang}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      name="kategoriProduk"
                      label="Kategori"
                      fullWidth
                      value={formData.kategoriProduk}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(90deg, #03ac0e 0%, #1abc9c 100%)',
                      fontWeight: 'bold',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #02940c 0%, #16a085 100%)'
                      }
                    }}
                  >
                    Simpan
                  </Button>
                </Grid>
              </Grid>
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
        </main>
      </div>
    </div>
  );

};

export default CreateItem;
