import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Pending", value: "" },
  { label: "Diproses", value: "PACKED" },
  { label: "Dikirim", value: "SHIPPED" },
  { label: "Terkirim", value: "DELIVERED" },
  { label: "Dibatalkan", value: "CANCELED" },
];

// "PENDING", "PROCESSING", "SHIPPING", "COMPLETED", "CANCELED"

const statusColor = (status: string) => {
  switch (status) {
    case "":
      return "warning";
    case "PACKED":
      return "info";
    case "SHIPPED":
      return "primary";
    case "DELIVERED":
      return "success";
    case "CANCELED":
      return "error";
    default:
      return "default";
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "":
      return "Pending";
    case "PACKED":
      return "Diproses";
    case "SHIPPED":
      return "Dikirim";
    case "DELIVERED":
      return "Terkirim";
    case "CANCELED":
      return "Dibatalkan";
    default:
      return status;
  }
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    tab === 0
      ? orders.filter(
          (o) =>
            o.userId ===
            JSON.parse(atob(localStorage.getItem("token")!.split(".")[1]))
              .userId
        )
      : orders.filter(
          (o) =>
            o.userId ===
              JSON.parse(atob(localStorage.getItem("token")!.split(".")[1]))
                .userId &&
            (tab === 1
              ? !o.statusPengiriman && o.statusPesanan !== "CANCELED" // Pending
              : tab === 2
              ? o.statusPengiriman === "PACKED" &&
                o.statusPesanan !== "CANCELED"
              : tab === 3
              ? o.statusPengiriman === "SHIPPED" &&
                o.statusPesanan !== "CANCELED"
              : tab === 4
              ? o.statusPengiriman === "DELIVERED" &&
                o.statusPesanan !== "CANCELED"
              : tab === 5
              ? o.statusPesanan === "CANCELED"
              : true)
        );

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Batalkan pesanan ini?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/order/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        await fetchOrders(); // re-fetch orders from backend
      } else {
        const data = await res.json();
        alert(data.message || "Gagal membatalkan pesanan.");
      }
    } catch {
      alert("Gagal membatalkan pesanan.");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <NavigationBar />
      <Box sx={{ maxWidth: 1100, mx: "auto", pt: 4, px: 2 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="#222">
          Riwayat Pesanan
        </Typography>
        <Paper sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 2,
              bgcolor: "#fff",
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: 16,
                textTransform: "none",
                transition: "color 0.2s",
                "&:hover": { color: "#03ac0e" },
              },
              "& .Mui-selected": { color: "#03ac0e !important" },
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <Tab key={s.value} label={s.label} />
            ))}
          </Tabs>
        </Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="#888" fontSize={18}>
              Tidak ada pesanan.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredOrders.map((order) => (
              <Grid item xs={12} key={order.orderId}>
                <Paper
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    boxShadow: 3,
                    mb: 2,
                    transition: "box-shadow 0.2s, border 0.2s",
                    border: "2px solid transparent",
                    "&:hover": {
                      boxShadow: 6,
                      border: "2px solid #03ac0e",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ md: "center" }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      flexWrap="wrap"
                    >
                      <Chip
                        label={statusLabel(
                          order.statusPesanan == "CANCELED"
                            ? order.statusPesanan
                            : order.statusPengiriman
                        )}
                        color={statusColor(
                          order.statusPesanan == "CANCELED"
                            ? order.statusPesanan
                            : order.statusPengiriman
                        )}
                        sx={{
                          fontWeight: 700,
                          fontSize: 14,
                          textTransform: "capitalize",
                        }}
                      />
                      <Typography color="#888" fontSize={14}>
                        {new Date(order.waktuTransaksi).toLocaleString("id-ID")}
                      </Typography>
                      <Typography color="#888" fontSize={14}>
                        {order.orderItems.length} produk
                      </Typography>
                    </Box>
                    <Box mt={{ xs: 2, md: 0 }}>
                      <Typography
                        fontWeight={700}
                        color="#03ac0e"
                        fontSize={18}
                      >
                        {order.orderItems
                          .reduce(
                            (sum: number, item: any) =>
                              sum + item.hargaBarang * item.quantity,
                            0
                          )
                          .toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })
                          .replace(",00", "")}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {order.orderItems.map((item: any) => (
                      <Grid item xs={12} sm={6} md={4} key={item.orderItemId}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            bgcolor: "#fafbfc",
                            borderRadius: 2,
                            p: 1.5,
                            boxShadow: 1,
                            transition: "box-shadow 0.2s, transform 0.2s",
                            "&:hover": {
                              boxShadow: 3,
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={
                              item.barang.fotoBarang &&
                              item.barang.fotoBarang.startsWith("http")
                                ? item.barang.fotoBarang
                                : `${import.meta.env.VITE_STATIC_URL}/${
                                    item.barang.fotoBarang
                                  }`
                            }
                            alt={item.barang.namaBarang}
                            sx={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 2,
                              bgcolor: "#eee",
                              mr: 2,
                            }}
                          />
                          <Box flex={1}>
                            <Typography fontWeight={600} fontSize={15} noWrap>
                              {item.barang.namaBarang}
                            </Typography>
                            <Typography color="#888" fontSize={13}>
                              {item.quantity} x{" "}
                              {item.hargaBarang
                                .toLocaleString("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                })
                                .replace(",00", "")}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                    {order.statusPengiriman === "PENDING" &&
                      order.statusPesanan != "CANCELED" && (
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ fontWeight: 600 }}
                          onClick={() => handleCancelOrder(order.orderId)}
                        >
                          Batalkan Pesanan
                        </Button>
                      )}
                    {order.statusPengiriman === "SHIPPED" && (
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      >
                        Konfirmasi Terima
                      </Button>
                    )}
                    <Button
                      variant="text"
                      sx={{ fontWeight: 600, color: "#03ac0e" }}
                      onClick={() =>
                        navigate(
                          `/product/${order.orderItems[0].barang.barangId}`
                        )
                      }
                    >
                      Lihat Detail
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default OrderHistory;
