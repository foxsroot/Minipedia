import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import NavigationBar from "../components/NavigationBar";
import { useCartContext } from "../contexts/CartContext";
import type { Barang } from "../interfaces/Barang";
import "../styles/main.css";

const theme = createTheme({
  palette: {
    primary: { main: "#03AC0E" },
    secondary: { main: "#E0F2E9" },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
  shape: {
    borderRadius: 12,
  },
});

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, editCartItem } = useCartContext();
  const [items, setItems] = useState<Barang[]>([]);

  const fetchCartItems = async () => {
    const fetchedItems: Barang[] = [];
    for (const item of cartItems) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/barang/${item.barangId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data: Barang = await response.json();
        fetchedItems.push(data);
        setItems([...fetchedItems]);
      } catch (error) {
        console.error("Error fetching cart item:", error);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty > 0) editCartItem(itemId, newQty);
  };

  useEffect(() => {
    fetchCartItems();
  }, [cartItems]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationBar />
      <Box
        sx={{
          p: 3,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Your Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Typography variant="body1">Keranjang masih kosong.</Typography>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {cartItems.map((cartItem) => {
              const barang = items.find(
                (item) => item.barangId === cartItem.barangId
              );
              if (!barang) return null;

              const totalPrice = barang.hargaBarang * cartItem.quantity;

              return (
                <Grid
                  item
                  xs={12}
                  key={cartItem.barangId}
                  sx={{
                    width: "100%",
                    maxWidth: "100vw", // Increased width
                    mx: "auto",
                  }}
                >
                  <Card
                    sx={{
                      display: "flex",
                      p: 2,
                      bgcolor: "#fff",
                      boxShadow: 2,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left section: Image + info + buttons */}
                    <Box sx={{ display: "flex", flex: 1 }}>
                      <CardMedia
                        component="img"
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                          mr: 2,
                        }}
                        image={barang.fotoBarang || "/default-product.png"}
                        alt={barang.namaBarang}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          flex: 1,
                        }}
                      >
                        <CardContent sx={{ pb: 1 }}>
                          <Typography variant="h6">
                            {barang.namaBarang}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Harga Satuan: Rp{" "}
                            {barang.hargaBarang.toLocaleString("id-ID")}
                          </Typography>
                        </CardContent>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.barangId,
                                cartItem.quantity - 1
                              )
                            }
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography>{cartItem.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.barangId,
                                cartItem.quantity + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(cartItem.barangId)}
                            aria-label="hapus"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    {/* Right section: total price */}
                    <Box
                      sx={{
                        minWidth: 140,
                        textAlign: "right",
                        px: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography variant="h6" color="primary">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/checkout")}
            disabled={cartItems.length === 0}
            size="large"
            sx={{ borderRadius: 3, px: 4, py: 1.5 }}
          >
            Lanjut ke Pembayaran
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Cart;
