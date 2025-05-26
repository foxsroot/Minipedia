import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

interface OrderItem {
  barangId: string;
  quantity: number;
}

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    namaPenerima: string;
    nomorTelepon: string;
    pengiriman: string;
    orderItems: OrderItem[];
    alamatPengiriman: string;
  }) => void;
  orderItems: OrderItem[];
}

const pengirimanOptions = ["JNE", "JNT", "SICEPAT"];

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
  onConfirm,
  orderItems,
}) => {
  const [namaPenerima, setNamaPenerima] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [pengiriman, setPengiriman] = useState(pengirimanOptions[0]);
  const [alamatPengiriman, setAlamatPengiriman] = useState("");

  const handleConfirm = () => {
    if (!namaPenerima || !nomorTelepon || !pengiriman) {
      alert("Mohon lengkapi semua data.");
      return;
    }
    onConfirm({
      namaPenerima,
      nomorTelepon,
      pengiriman,
      orderItems,
      alamatPengiriman,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Informasi Pengiriman</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nama Penerima"
            value={namaPenerima}
            onChange={(e) => setNamaPenerima(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Nomor Telepon"
            value={nomorTelepon}
            onChange={(e) => setNomorTelepon(e.target.value)}
            fullWidth
            required
            type="tel"
          />
          <TextField
            label="Alamat Pengiriman"
            value={alamatPengiriman}
            onChange={(e) => setAlamatPengiriman(e.target.value)}
            fullWidth
            required
            multiline
            minRows={2}
            sx={{ mt: 1 }}
          />
          <TextField
            select
            label="Pilih Pengiriman"
            value={pengiriman}
            onChange={(e) => setPengiriman(e.target.value)}
            fullWidth
            required
          >
            {pengirimanOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, pb: 3, pt: 2, justifyContent: "space-between" }}
      >
        <Button
          onClick={onClose}
          color="error"
          variant="outlined"
          sx={{ mr: 1, fontWeight: "bold", borderWidth: 2 }}
          fullWidth
        >
          Batal
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ ml: 1 }}
        >
          Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog;
