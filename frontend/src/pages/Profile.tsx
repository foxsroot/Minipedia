import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";

const theme = createTheme({
  palette: {
    primary: { main: "#03AC0E" },
    secondary: { main: "#F3F4F6" },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
  shape: {
    borderRadius: 12,
  },
});

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    nama: "",
    nomorTelpon: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editSuccess, setEditSuccess] = useState(false);
  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setProfile({
            nama: data.nama,
            nomorTelpon: data.nomorTelpon,
            email: data.email,
          });
        }
      } catch {}
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          alert("Gagal menghapus akun. Silakan coba lagi.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Terjadi kesalahan saat menghapus akun. Silakan coba lagi.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });
      if (res.ok) setEditSuccess(true);
    } catch {}
  };

  const handleChangePassword = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      if (res.ok) {
        setOldPassword("");
        setNewPassword("");
        setPwDialogOpen(false);
        setTimeout(() => setPwSuccess(true), 300); // show success after dialog closes
      } else {
        const response = await res.json();
        alert(response.message || "Gagal mengganti password.");
      }
    } catch {}
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationBar />
      <CssBaseline />
      <Box sx={{ maxWidth: "80vw", mx: "auto", mt: 6, p: 2 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Grid container spacing={4}>
            {/* LEFT PANEL */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src="/profile.png"
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                {/* <Button variant="outlined" size="small">
                  Pilih Foto
                </Button>
                <Typography variant="body2" mt={1} textAlign="center">
                  Besar file: maksimum 10MB. Ekstensi: .JPG, .JPEG, .PNG
                </Typography>
                <Divider sx={{ my: 3, width: "100%" }} /> */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setPwDialogOpen(true)}
                >
                  Ganti Password
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={handleDeleteAccount}
                >
                  Hapus Akun
                </Button>
              </Box>
            </Grid>

            {/* RIGHT PANEL */}
            <Grid item xs={12} md={8}>
              <Box sx={{ pl: { md: 4 }, width: "63vw" }}>
                <Typography variant="h6" gutterBottom>
                  Ubah Biodata Diri
                </Typography>
                <TextField
                  label="Nama"
                  name="nama"
                  value={profile.nama}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Typography variant="h6" mt={3} gutterBottom>
                  Ubah Kontak
                </Typography>
                <TextField
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  //   InputProps={{
                  //     endAdornment: (
                  //       <InputAdornment position="end">
                  //         <CheckCircle color="success" fontSize="small" />
                  //       </InputAdornment>
                  //     ),
                  //   }}
                />
                <TextField
                  label="Nomor HP"
                  name="nomorTelpon"
                  value={profile.nomorTelpon}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  //   InputProps={{
                  //     endAdornment: (
                  //       <InputAdornment position="end">
                  //         <CheckCircle color="success" fontSize="small" />
                  //       </InputAdornment>
                  //     ),
                  //   }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={handleSave}
                  fullWidth
                >
                  Simpan
                </Button>

                {editSuccess && (
                  <Typography color="success.main" sx={{ mt: 2, fontSize: 14 }}>
                    Perubahan berhasil disimpan!
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={pwDialogOpen}
        onClose={() => setPwDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Ganti Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Password Lama"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password Baru"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwDialogOpen(false)} color="secondary">
            Batal
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
          >
            Simpan Password
          </Button>
        </DialogActions>
      </Dialog>
      {/* Show password change success message after dialog is closed */}
      {pwSuccess && !pwDialogOpen && (
        <Typography
          color="success.main"
          sx={{ px: 3, pb: 2, textAlign: "center" }}
        >
          Password berhasil diganti!
        </Typography>
      )}
    </ThemeProvider>
  );
};

export default Profile;
