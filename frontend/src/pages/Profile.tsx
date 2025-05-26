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
} from "@mui/material";

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

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
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
          method: "POST",
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
        setPwSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setPwDialogOpen(false);
      }
    } catch {}
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: 420, mx: "auto", mt: 6, p: 2 }}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            gutterBottom
          >
            Profil Saya
          </Typography>
          <TextField
            label="Nama"
            name="nama"
            value={profile.nama}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nomor Telepon"
            name="nomorTelpon"
            value={profile.nomorTelpon}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="email"
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: "100%" }}
            onClick={handleSave}
            disabled={loading}
          >
            Simpan Perubahan
          </Button>
          {editSuccess && (
            <Typography color="success.main" sx={{ mt: 1 }}>
              Profil berhasil diperbarui!
            </Typography>
          )}
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 3, width: "100%" }}
            onClick={() => setPwDialogOpen(true)}
          >
            Ganti Password
          </Button>
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
        {pwSuccess && (
          <Typography color="success.main" sx={{ px: 3, pb: 2 }}>
            Password berhasil diganti!
          </Typography>
        )}
      </Dialog>
    </ThemeProvider>
  );
};

export default Profile;
