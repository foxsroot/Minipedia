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
        checked: false,
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

    console.log("Detail Barang:", barang);
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
            <Grid item xs={12} md={4} sx={{ width: "20em", height: "20em" }}>
              <Card elevation={1} sx={{ width: "20em", height: "20em" }}>
                <CardMedia
                  component="img"
                  image={`${import.meta.env.VITE_STATIC_URL}/${
                    barang?.fotoBarang
                  }`}
                  alt="Product Image"
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
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

                <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
                  {!barang?.jumlahTerjual || barang.jumlahTerjual === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Belum Terjual🤣
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Terjual {barang.jumlahTerjual}
                    </Typography>
                  )}
                </Box>

                {/* Harga dengan diskon */}
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  {barang?.diskonProduk && barang.diskonProduk > 0 ? (
                    <>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: "#00AA5B" }}
                      >
                        {(barang.hargaBarang - (barang.hargaBarang * barang.diskonProduk) / 100)
                          .toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })
                          .replace(",00", "")}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: "line-through",
                          color: "#888",
                          fontWeight: 400,
                          fontSize: "1.2rem",
                        }}
                      >
                        {barang.hargaBarang
                          .toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })
                          .replace(",00", "")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          bgcolor: "#ff5e8b",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "1rem",
                          px: 1.2,
                          py: 0.5,
                          borderRadius: 1,
                          ml: 1,
                        }}
                      >
                        {barang.diskonProduk}%
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ color: "#00AA5B" }}
                    >
                      {barang?.hargaBarang
                        .toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })
                        .replace(",00", "")}
                    </Typography>
                  )}
                </Box>
                {/* End harga dengan diskon */}

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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {barang?.diskonProduk && barang.diskonProduk > 0 ? (
                    <>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#00AA5B" }}>
                        {((barang.hargaBarang - (barang.hargaBarang * barang.diskonProduk) / 100) * quantity)
                          .toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })
                          .replace(",00", "")}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#00AA5B" }}>
                      {(totalPrice ?? 0)
                        .toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })
                        .replace(",00", "")}
                    </Typography>
                  )}
                </Box>

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
                  Beli Barang
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
