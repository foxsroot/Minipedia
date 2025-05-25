import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import ItemBox from "../components/ItemBox";
import type { Barang } from "../interfaces/Barang";

// const items = [
//   {
//     imageUrl:
//       "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/2/23/7a687776-af5d-49a8-bb11-469f0b378a9e.jpg",
//     title: "Neo Ergolift Standing Desk 140cm",
//     category: "Meja",
//     price: 2886000,
//     originalPrice: 3099000,
//     discount: 7,
//     stockLeft: 0,
//     location: "Jakarta Barat",
//     rating: 4.6,
//     sold: 43,
//     storeName: "Toko A",
//   },
//   {
//     imageUrl:
//       "https://images.tokopedia.net/img/cache/900/o3syd0/1997/1/1/22dc69723d4f47a5973df24431e6fc9d~.jpeg",
//     title: "Keyboard Keychron K5 Max",
//     category: "Keyboard",
//     price: 1480000,
//     originalPrice: 1580000,
//     discount: 6,
//     stockLeft: 2,
//     location: "Bandung",
//     rating: 4.8,
//     sold: 175,
//     storeName: "Toko B",
//   },
//   {
//     imageUrl: "https://images.tokopedia.net/img/cache/500-square/product-3.jpg",
//     title: "Monitor ROG 27 Inch 144Hz",
//     category: "Monitor",
//     price: 4000000,
//     stockLeft: 1,
//     location: "Jakarta Selatan",
//     rating: 4.9,
//     sold: 8563,
//     storeName: "Toko C",
//   },
// ];

const Home = () => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [barangs, setBarangs] = useState<Barang[]>([]);

  const fetchBarangs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/barang`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.log("Failed to fetch barang data:", response.statusText);
      }

      const data = await response.json();
      console.log(data);
      setBarangs(data);
    } catch (error) {
      console.error("Error fetching barang data:", error);
    }
  };

  useEffect(() => {
    fetchBarangs();
  }, []);

  const handleLocationChange = (value: string) => {
    setSelectedLocations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue);
      setMinPrice(newValue[0]);
      setMaxPrice(newValue[1]);
    }
  };

  const filteredItems = barangs.filter((barang) => {
    const price = barang.hargaBarang;
    const inPriceRange = price >= minPrice && price <= maxPrice;
    const matchLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(barang.toko.lokasiToko || "");
    const matchAvailability = onlyAvailable ? barang.stokBarang == 0 : true;
    const matchCategory = selectedCategory
      ? barang.kategoriProduk === selectedCategory
      : true;

    return inPriceRange && matchLocation && matchAvailability && matchCategory;
  });

  return (
    <div className="home-tokopedia-bg">
      <NavigationBar />

      <Box sx={{ display: "flex", p: 2 }}>
        {/* Filter Sidebar */}
        <Box
          sx={{
            width: 300,
            pr: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: 2,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Filter
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedCategory}
                label="Kategori"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">Semua</MenuItem>
                <MenuItem value="Meja">Meja</MenuItem>
                <MenuItem value="Keyboard">Keyboard</MenuItem>
                <MenuItem value="Monitor">Monitor</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle2" gutterBottom>
              Lokasi
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleLocationChange("Jakarta Barat")}
                    checked={selectedLocations.includes("Jakarta Barat")}
                  />
                }
                label="Jakarta Barat"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleLocationChange("Bandung")}
                    checked={selectedLocations.includes("Bandung")}
                  />
                }
                label="Bandung"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleLocationChange("Jakarta Selatan")}
                    checked={selectedLocations.includes("Jakarta Selatan")}
                  />
                }
                label="Jakarta Selatan"
              />
            </FormGroup>

            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Harga
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={5000000}
              step={100000}
              sx={{ color: "#03ac0e" }}
            />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <TextField
                type="number"
                size="small"
                label="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                fullWidth
              />
              <TextField
                type="number"
                size="small"
                label="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Rating
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Semua</MenuItem>
                <MenuItem value="4.5">4.5 ke atas</MenuItem>
                <MenuItem value="4">4.0 ke atas</MenuItem>
                <MenuItem value="3.5">3.5 ke atas</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
              }
              label="Tersedia saja"
              sx={{ mt: 2 }}
            />
          </Box>
        </Box>

        {/* Items Grid */}
        <Box sx={{ flexGrow: 1, ml: 3 }}>
          <Grid container spacing={2}>
            {filteredItems.map((item, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <ItemBox {...item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
