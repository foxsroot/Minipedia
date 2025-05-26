import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, TextField, Typography, Button, Grid, Paper, Box, Snackbar, Alert
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import SellerNavbar from '../components/SellerNavbar';
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
    kategoriProduk: 'ELECTRONICS', // Set a default value for kategoriProduk
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
      kategoriProduk: 'ELECTRONICS', // Reset to default value
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
        <h2 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Products Management
          <Button
            variant="contained"
            sx={{
              ml: 2,
              background: 'linear-gradient(90deg, #03ac0e 0%, #1abc9c 100%)',
              fontWeight: 'bold',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #02940c 0%, #16a085 100%)'
              }
            }}
            onClick={() => navigate('/manage-product')}
          >
            Back
          </Button>
        </h2>

        <Container maxWidth="sm">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mt: 4, bgcolor: '#fdfdfd' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#03ac0e' }}>
              Tambahkan Produk
            </Typography>

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

                <Grid container item xs={12} spacing={2}>
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
                    <TextField
                      select
                      name="kategoriProduk"
                      label="Kategori"
                      fullWidth
                      value={formData.kategoriProduk}
                      onChange={handleChange}
                      required
                      sx={{
                        "& .MuiSelect-select": {
                          minWidth: "100%", // Ensure the dropdown spans the full width
                        },
                      }}
                    >
                      {kategoriOptions.map((option) => (
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
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      background: 'linear-gradient(90deg, #03ac0e 0%, #1abc9c 100%)',
                      fontWeight: 'bold',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #02940c 0%, #16a085 100%)'
                      }
                    }}
                  >
                    Simpan Barang
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
        </Container>
      </main>
    </div>
  </div>
);
};

export default CreateItem;
