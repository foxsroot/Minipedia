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
  Checkbox,
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(itemId);
      return;
    }

    const barang = items.find((barang) => barang.barangId === itemId);

    if (!barang) return;

    if (newQty > barang.stokBarang) {
      alert(`Stok tidak mencukupi. Hanya tersedia ${barang.stokBarang} item.`);
      editCartItem(itemId, barang.stokBarang);
      return;
    }
    if (newQty > 0) editCartItem(itemId, newQty);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  useEffect(() => {
    fetchCartItems();
  }, [cartItems]);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, cartItem) => {
      if (selectedItems.includes(cartItem.barangId)) {
        const barang = items.find(
          (item) => item.barangId === cartItem.barangId
        );
        if (barang) {
          return acc + barang.hargaBarang * cartItem.quantity;
        }
      }
      return acc;
    }, 0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ p: 3, width: "100%", overflowX: "hidden", pb: 10 }}>
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
                <Grid item xs={12} key={cartItem.barangId}>
                  <Card
                    sx={{
                      display: "flex",
                      p: 2,
                      bgcolor: "#fff",
                      boxShadow: 2,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "97vw",
                      mx: -3, // counter padding for full-width effect
                    }}
                  >
                    <Checkbox
                      checked={selectedItems.includes(cartItem.barangId)}
                      onChange={() => toggleItemSelection(cartItem.barangId)}
                      sx={{ mr: 2 }}
                    />
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

                    <Box sx={{ minWidth: 140, textAlign: "right", px: 2 }}>
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
      </Box>

      {selectedItems.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            bgcolor: "#fff",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            p: 2,
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6" sx={{ ml: 2, color: "text.primary" }}>
            Subtotal: Rp {calculateSubtotal().toLocaleString("id-ID")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate("/checkout", {
                state: {
                  selectedItems: cartItems.filter((item) =>
                    selectedItems.includes(item.barangId)
                  ),
                },
              })
            }
            size="large"
            sx={{ borderRadius: 0.5, px: 4, py: 1.5, mt: { xs: 2, sm: 0 } }}
          >
            Lanjut ke Pembayaran
          </Button>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Cart;
