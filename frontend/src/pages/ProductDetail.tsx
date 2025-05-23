import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  TextField,
  Grid,
  Rating,
  Divider,
  Chip,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import NavigationBar from "../components/NavigationBar";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [price, setPrice] = useState(1695000);
  const stock = 8;

  const handleQuantityChange = (val: number) => {
    if (val >= 1 && val <= stock) setQuantity(val);
  };

  useEffect(() => {
    setTotalPrice(quantity * price);
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
                  image="https://images.tokopedia.net/img/cache/900/VqbcmM/2024/2/23/7a687776-af5d-49a8-bb11-469f0b378a9e.jpg"
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
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Keychron V5 Max QMK/VIA Wireless Fully Assembled Knob - Carbon
                  Black - GJ Red
                </Typography>

                <Box
                  sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Terjual 25
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Rating size="small" value={5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    (7 rating)
                  </Typography>
                </Box>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mt: 2, color: "#00AA5B" }}
                >
                  {price
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
                    Keychron V5 Max QMK/VIA Wireless Fully Assembled Knob -
                    Carbon Black
                    <br />
                    Width 148.7 mm <br />
                    Length 391.5 mm <br />
                    Front Height 21.5 mm (without keycaps)...
                  </Typography>
                  <Typography
                    sx={{
                      color: "#00AA5B",
                      mt: 1,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Lihat Selengkapnya
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
                    inputProps={{ min: 1, max: stock }}
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
                  Sisa {stock}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {totalPrice
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
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
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
