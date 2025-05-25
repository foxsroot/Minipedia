import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  TextField,
  Grid,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import NavigationBar from "../components/NavigationBar";
import { useParams } from "react-router-dom";
import type { Barang } from "../interfaces/Barang";
import { useCartContext } from "../contexts/CartContext";

const ProductDetail = () => {
  const { barangId } = useParams<{ barangId: string }>();
  const [barang, setBarang] = useState<Barang>();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState<number>();
  const [showCopied, setShowCopied] = useState(false);
  const { addToCart, getFromCart } = useCartContext();

  const handleAddToCart = () => {
    if (barang) {
      const existingItem = getFromCart(barang.barangId);

      if ((existingItem?.quantity ?? 0) + quantity > barang.stokBarang) {
        alert(
          `Jumlah yang dimasukkan melebihi stok yang tersedia (${barang.stokBarang}).`
        );
        return;
      }

      addToCart({
        barangId: barang.barangId,
        quantity: quantity,
      });
    }
  };

  const handleQuantityChange = (val: number) => {
    if (val >= 1 && val <= (barang?.stokBarang ?? 0)) setQuantity(val);
  };

  const fetchProductDetails = async (barangId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/barang/${barangId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch product details:", response.statusText);
        return;
      }

      const data = await response.json();
      setBarang(data);
      setTotalPrice(data.hargaBarang);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    if (barangId) {
      fetchProductDetails(barangId);
    }
  }, []);

  useEffect(() => {
    if (barang?.hargaBarang !== undefined) {
      setTotalPrice(quantity * barang.hargaBarang);
    }
  }, [quantity]);

  return (
    <>
      <NavigationBar />
      <Box sx={{ bgcolor: "#f5f5f5", py: 6 }}>
        <Box sx={{ maxWidth: "100vw", mx: "auto", px: 2 }}>
          <Grid container spacing={4} justifyContent="center">
            {/* Image Column */}
            <Grid item xs={12} md={4}>
              <Card elevation={1}>
                <CardMedia
                  component="img"
                  image={
                    "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/2/23/7a687776-af5d-49a8-bb11-469f0b378a9e.jpg"
                  }
                  alt="Product Image"
                  sx={{
                    objectFit: "cover",
                    width: "25rem",
                    height: "25rem",
                    borderRadius: 2,
                  }}
                />
              </Card>
            </Grid>

            {/* Product Details Column */}
            <Grid item xs={12} md={5} width={"50vw"}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {barang?.namaBarang || "Unknown Barang"}
                </Typography>

                <Box
                  sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}
                >
                  {barang?.jumlahTerjual == 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Belum Terjual🤣
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Terjual {barang?.jumlahTerjual}
                    </Typography>
                  )}
                </Box>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mt: 2, color: "#00AA5B" }}
                >
                  {barang?.hargaBarang
                    .toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                    .replace(",00", "")}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <b>Kondisi:</b> Baru <br />
                    <b>Min. Pemesanan:</b> 1 Buah <br />
                    <b>Etalase:</b>{" "}
                    <span style={{ color: "#00AA5B" }}>Semua Etalase</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {barang?.deskripsiBarang}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Purchase Box Column */}
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 3,
                  bgcolor: "#fff",
                  position: { md: "sticky" },
                  top: { md: 100 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    variant="outlined"
                  >
                    -
                  </Button>
                  <TextField
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value))
                    }
                    inputProps={{ min: 1, max: barang?.stokBarang }}
                    sx={{ width: 60, mx: 1 }}
                  />
                  <Button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    variant="outlined"
                  >
                    +
                  </Button>
                </Box>

                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Sisa {barang?.stokBarang}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {(totalPrice ?? 0)
                    .toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                    .replace(",00", "")}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: "#00AA5B",
                    ":hover": { bgcolor: "#009a50" },
                  }}
                  onClick={handleAddToCart}
                >
                  + Keranjang
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  sx={{ mt: 1 }}
                >
                  Beli Langsung
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <IconButton
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      setShowCopied(true);
                      setTimeout(() => setShowCopied(false), 1500);
                    }}
                  >
                    <ShareIcon />
                  </IconButton>

                  {showCopied && (
                    <Box
                      sx={{
                        height: "100%",
                        mt: "7px",
                        mr: "35%",
                        bgcolor: "#333",
                        color: "#fff",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: 12,
                        zIndex: 10,
                        boxShadow: 2,
                      }}
                    >
                      Copied to clipboard
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ProductDetail;
