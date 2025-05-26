import { useContext, useEffect, useState } from "react";
import CheckoutDialog from "../components/CheckoutDialog";
import {
  Box,
  Typography,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import NavigationBar from "../components/NavigationBar";
import { useCartContext } from "../contexts/CartContext";

interface CheckOutProps {
  productId: string;
  quantity: number;
}

interface Barang {
  barangId: string;
  namaBarang: string;
  fotoBarang: string;
  hargaBarang: number;
}

const theme = createTheme({
  palette: {
    primary: { main: "#03AC0E" }, // Tokopedia Green
    secondary: { main: "#F3F4F6" }, // Light Gray
    background: { default: "#ffffff" },
    text: {
      primary: "#000000",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
  shape: {
    borderRadius: 12,
  },
});

const Checkout = () => {
  const [checkoutItems, setCheckoutItems] = useState<CheckOutProps[]>([]);
  const [items, setItems] = useState<
    (Barang & { quantity: number; totalPrice: number })[]
  >([]);
  const { removeFromCart } = useCartContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const cartItemsRaw = localStorage.getItem("cartItems");
    if (cartItemsRaw) {
      try {
        const parsed = JSON.parse(cartItemsRaw);
        if (Array.isArray(parsed)) {
          const selected = parsed
            .filter((item: any) => item.selected)
            .map((item: any) => ({
              productId: item.barangId,
              quantity: item.quantity,
            }));
          setCheckoutItems(selected);
        }
      } catch {}
    }
  }, []);

  const handleDialogConfirm = async ({
    namaPenerima,
    nomorTelepon,
    pengiriman,
    orderItems,
    alamatPengiriman,
  }: {
    namaPenerima: string;
    nomorTelepon: string;
    pengiriman: string;
    alamatPengiriman: string;
    orderItems: { barangId: string; quantity: number }[];
  }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            orderItems,
            namaPenerima,
            nomorTelpon: nomorTelepon,
            pengiriman,
            alamatPengiriman,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Gagal membuat pesanan.");
        return;
      } else {
        orderItems.forEach((item) => {
          removeFromCart(item.barangId);
        });

        setCheckoutItems([]);

        navigate("/order-history");
      }

      const data = await response.json();
      alert("Pesanan berhasil dibuat! Order ID: " + data.orderId);
      setDialogOpen(false);
    } catch (err) {
      alert("Terjadi kesalahan saat checkout.");
      console.error(err);
    }
  };

  const fetchItems = async () => {
    const results: (Barang & { quantity: number; totalPrice: number })[] = [];
    for (const item of checkoutItems) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/barang/${item.productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch item");
        const data: Barang = await res.json();
        results.push({
          ...data,
          quantity: item.quantity,
          totalPrice: data.hargaBarang * item.quantity,
        });
      } catch (err) {
        console.error(err);
      }
    }
    setItems(results);
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.1;
  const adminFee = 5000;
  const grandTotal = subtotal + tax + adminFee;
  useEffect(() => {
    if (checkoutItems.length > 0) {
      fetchItems();
    } else {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutItems]);

  return (
    <ThemeProvider theme={theme}>
      <NavigationBar />
      <CssBaseline />
      <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 600 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 0,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            p: { xs: 2, md: 4 },
            mb: 3,
            width: "95vw",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color="#222"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              letterSpacing: 0.5,
            }}
          >
            Ringkasan Belanja
          </Typography>

          <Box sx={{ mb: 3 }}>
            {items.map((item) => (
              <Box
                key={item.barangId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  //   borderBottom: "1px solid #f0f0f0",
                  py: 1,
                  px: 0,
                  mb: 0.5,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <img
                    src={
                      item.fotoBarang
                        ? item.fotoBarang.startsWith("http")
                          ? item.fotoBarang
                          : `${import.meta.env.VITE_STATIC_URL}/${
                              item.fotoBarang
                            }`
                        : "/default-product.png"
                    }
                    alt={item.namaBarang}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.97rem", md: "1.05rem" },
                      color: "#222",
                      lineHeight: 1.2,
                    }}
                    noWrap
                  >
                    {item.namaBarang}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.85rem", md: "0.93rem" },
                      color: "#888",
                    }}
                    noWrap
                  >
                    {item.quantity} barang x Rp{" "}
                    {item.hargaBarang.toLocaleString("id-ID")}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 90, textAlign: "right" }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1rem", md: "0.97rem" },
                      color: "#222",
                    }}
                  >
                    Rp {item.totalPrice.toLocaleString("id-ID")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Bottom - Summary */}
          <Box
            sx={{
              borderTop: "1px solid #e0e0e0",
              pt: 2,
              backgroundColor: "#fff",
              zIndex: 100,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: "1.05rem", md: "1.13rem" }, color: "#222" }}
            >
              Detail Pembayaran
            </Typography>
            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography sx={{ fontSize: "0.97rem", color: "#444" }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontSize: "0.97rem", color: "#444" }}>
                Rp {subtotal.toLocaleString("id-ID")}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography sx={{ fontSize: "0.97rem", color: "#444" }}>
                PPN (10%)
              </Typography>
              <Typography sx={{ fontSize: "0.97rem", color: "#444" }}>
                Rp {tax.toLocaleString("id-ID")}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography sx={{ fontSize: "0.97rem", color: "#444" }}>
                Biaya Admin
              </Typography>
              <Typography sx={{ fontSize: "0.97rem", color: "#444" }}>
                Rp {adminFee.toLocaleString("id-ID")}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between" py={1}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "1.13rem", md: "1.18rem" },
                  color: "#222",
                }}
              >
                Total
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="primary"
                sx={{ fontSize: { xs: "1.13rem", md: "1.18rem" } }}
              >
                Rp {grandTotal.toLocaleString("id-ID")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: "100%",
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  py: 1.2,
                  boxShadow: "0 2px 8px rgba(3,172,14,0.08)",
                  letterSpacing: 1,
                }}
                onClick={() => setDialogOpen(true)}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </Box>
        <CheckoutDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleDialogConfirm}
          orderItems={items.map((item) => ({
            barangId: item.barangId,
            quantity: item.quantity,
            hargaBarang: item.hargaBarang,
          }))}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Checkout;
