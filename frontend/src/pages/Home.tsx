import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  if (localStorage.getItem("token") === null) {
    navigate("/login");
  }

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
    const matchAvailability = onlyAvailable ? barang.stokBarang != 0 : true;
    const matchCategory = selectedCategory
      ? barang.kategoriProduk === selectedCategory
      : true;
    const matchSearch =
      searchQuery.trim() === "" ||
      barang.namaBarang.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      inPriceRange &&
      matchLocation &&
      matchAvailability &&
      matchCategory &&
      matchSearch
    );
  });

  return (
    <div className="home-tokopedia-bg">
      <NavigationBar onSearch={(query) => setSearchQuery(query)} />

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
                <MenuItem value="ELECTRONICS">Electronics</MenuItem>
                <MenuItem value="FASHION">Fashion</MenuItem>
                <MenuItem value="BEAUTY_HEALTH">Beauty & Health</MenuItem>
                <MenuItem value="HOME_LIVING">Home & Living</MenuItem>
                <MenuItem value="AUTOMOTIVE">Automotive</MenuItem>
                <MenuItem value="SPORTS_OUTDOORS">Sports & Outdoors</MenuItem>
                <MenuItem value="HOBBIES">Hobbies</MenuItem>
                <MenuItem value="BOOKS">Books</MenuItem>
                <MenuItem value="BABY_TOYS">Baby & Toys</MenuItem>
                <MenuItem value="FOOD_BEVERAGES">Food & Beverages</MenuItem>
                <MenuItem value="OFFICE_SUPPLIES">Office Supplies</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
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
                <ItemBox
                  barangId={item.barangId}
                  namaBarang={item.namaBarang}
                  fotoBarang={item.fotoBarang}
                  deskripsiBarang={item.deskripsiBarang}
                  stokBarang={item.stokBarang}
                  hargaBarang={item.hargaBarang}
                  diskonProduk={item.diskonProduk || 0}
                  jumlahTerjual={item.jumlahTerjual}
                  namaToko={item.toko.namaToko}
                  lokasiToko={item.toko.lokasiToko}
                  onClick={() => {
                    navigate(`/product/${item.barangId}`);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
