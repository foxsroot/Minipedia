import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Typography, Button, Grid, Paper, Box, Snackbar, Alert
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import SellerNavbar from '../components/SellerNavbar';
import SellerSidebar from '../components/SellerSidebar';

import NavigationBar from '../components/NavigationBar';
import SellerSidebar from '../components/SellerSidebar';

const CreateItem: React.FC = () => {
  const [formData, setFormData] = useState<{
    namaBarang: string;
    deskripsiBarang: string;
    stokBarang: string;
    hargaBarang: string;
    kategoriProduk: string;
    foto_barang: string;
    fotoBarang?: File | null;
  }>({
    namaBarang: '',
    deskripsiBarang: '',
    stokBarang: '',
    hargaBarang: '',
    kategoriProduk: '',
    foto_barang: '',
    fotoBarang: null,
  });

  // Enum values for kategoriProduk
  const kategoriOptions = [
    { value: "ELECTRONICS", label: "Electronics" },
    { value: "FASHION", label: "Fashion" },
    { value: "BEAUTY_HEALTH", label: "Beauty & Health" },
    { value: "HOME_LIVING", label: "Home & Living" },
    { value: "AUTOMOTIVE", label: "Automotive" },
    { value: "SPORTS_OUTDOORS", label: "Sports & Outdoors" },
    { value: "HOBBIES", label: "Hobbies" },
    { value: "BOOKS", label: "Books" },
    { value: "BABY_TOYS", label: "Baby & Toys" },
    { value: "FOOD_BEVERAGES", label: "Food & Beverages" },
    { value: "OFFICE_SUPPLIES", label: "Office Supplies" },
    { value: "OTHER", label: "Other" },
  ];

  const [snackbar, setSnackbar] = useState({ open: false, success: false, message: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setSaving(true);
  setError(null);
  setSuccess(null);

<<<<<<< HEAD
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  if (!formData.fotoBarang) {
    setError("Foto barang harus diupload.");
    setSaving(false);
    return;
  }

  const formDataImg = new FormData();
  formDataImg.append("namaBarang", formData.namaBarang || "");
  formDataImg.append("deskripsiBarang", formData.deskripsiBarang || "");
  formDataImg.append("stokBarang", String(Number(formData.stokBarang)) || "0");
  formDataImg.append("hargaBarang", String(Number(formData.hargaBarang)) || "0");
  formDataImg.append("kategoriProduk", formData.kategoriProduk || "");
  formDataImg.append("image", formData.fotoBarang);

  try {
    const res = await fetch(`/api/barang`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataImg,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) throw new Error(data?.message || data?.error || "Gagal menambahkan barang.");

    setSuccess("Barang berhasil ditambahkan!");
    setFormData({
      namaBarang: '',
      deskripsiBarang: '',
      stokBarang: '',
      hargaBarang: '',
      kategoriProduk: '',
      foto_barang: '',
      fotoBarang: null,
    });


  } catch (err: any) {
    setError(err.message || "Terjadi kesalahan.");
  }

  navigate("/manage-product");
  setSaving(false);
};


  return (
  <div>
    <SellerNavbar />
    <div style={{ display: "flex" }}>
      <SellerSidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24 }}>
          Products Management
        </h2>

        <Container maxWidth="sm">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mt: 4, bgcolor: '#fdfdfd' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#03ac0e' }}>
              Tambahkan Produk
            </Typography>

=======
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
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
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
<<<<<<< HEAD

=======
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
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

<<<<<<< HEAD
                <Grid container item xs={12} spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      name="stokBarang"
                      label="Stok Barang"
                      fullWidth
                      type="number"
=======
                {/* Grouped row for stok, harga, and kategori */}
                <Grid item container spacing={2} xs={12}>
                  <Grid item xs={4}>
                    <TextField
                      name="stokBarang"
                      label="Stok"
                      type="number"
                      fullWidth
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
                      value={formData.stokBarang}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      name="hargaBarang"
<<<<<<< HEAD
                      label="Harga Barang"
                      fullWidth
                      type="number"
=======
                      label="Harga"
                      type="number"
                      fullWidth
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
                      value={formData.hargaBarang}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
<<<<<<< HEAD
                      select
=======
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
                      name="kategoriProduk"
                      label="Kategori"
                      fullWidth
                      value={formData.kategoriProduk}
                      onChange={handleChange}
                      required
<<<<<<< HEAD
                    >
                      {kategoriOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    Upload Gambar
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setFormData({ ...formData, foto_barang: file.name, fotoBarang: file });
                        }
                      }}
                    />
                  </Button>
                  {formData.foto_barang && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {formData.foto_barang}
                    </Typography>
                  )}
=======
                    />
                  </Grid>
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
<<<<<<< HEAD
                      mt: 3,
=======
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
                      background: 'linear-gradient(90deg, #03ac0e 0%, #1abc9c 100%)',
                      fontWeight: 'bold',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #02940c 0%, #16a085 100%)'
                      }
                    }}
                  >
<<<<<<< HEAD
                    Simpan Barang
=======
                    Simpan
>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
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
<<<<<<< HEAD
        </Container>
      </main>
    </div>
  </div>
);
=======
        </main>
      </div>
    </div>
  );

>>>>>>> e01888df6a04e49000e25d164bee6c72ea4635f5
};

export default CreateItem;
