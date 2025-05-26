import React, { useEffect, useState } from "react";
import SellerNavbar from "../components/SellerNavbar";
import SellerSidebar from "../components/SellerSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, MenuItem } from "@mui/material";

const kategoriOptions = [
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "FASHION", label: "Fashion" },
  { value: "BEAUTY_HEALTH", label: "Beauty & Health" },
  { value: "HOME_LIVING", label: "Home & Living" },
  { value: "AUTOMOTIVE", label: "Automotive" },
  { value: "SPORTS_OUTDOORS", label: "Sports & Outdoors" },
  { value: "HOBBIES", label: "Hobbies" },
  { value: "BOOKS", label: "Books" },
  { value: "BABY_TOYS", label: "Baby & Toys" },
  { value: "FOOD_BEVERAGES", label: "Food & Beverages" },
  { value: "OFFICE_SUPPLIES", label: "Office Supplies" },
  { value: "OTHER", label: "Other" },
];

const UpdateProduct = () => {
  const [formData, setFormData] = useState({
    deskripsiBarang: "",
    stokBarang: "",
    hargaBarang: "",
    kategoriProduk: "ELECTRONICS",
    diskonProduk: "0",
  });
  const [namaBarang, setNamaBarang] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/barang/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            deskripsiBarang: data.deskripsiBarang || "",
            stokBarang: String(data.stokBarang ?? ""),
            hargaBarang: String(data.hargaBarang ?? ""),
            kategoriProduk: data.kategoriProduk || "ELECTRONICS",
            diskonProduk: String(data.diskonProduk ?? "0"),
          });
          setNamaBarang(data.namaBarang || "");
        } else {
          setMessage("Gagal mengambil data produk.");
        }
      } catch (err) {
        setMessage("Terjadi kesalahan saat mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("deskripsiBarang", formData.deskripsiBarang);
    formDataObj.append("stokBarang", formData.stokBarang);
    formDataObj.append("hargaBarang", formData.hargaBarang);
    formDataObj.append("kategoriProduk", formData.kategoriProduk);
    formDataObj.append("diskonProduk", formData.diskonProduk);

    try {
      const res = await fetch(`/api/barang/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error(data?.message || "Gagal mengupdate produk.");
      setMessage("Produk berhasil diupdate!");
      setTimeout(() => navigate("/manage-product"), 1500);
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan.");
    }
  };

  return (
    <div>
      <SellerNavbar />
      <div style={{ display: "flex" }}>
        <SellerSidebar />
        <main
          style={{
            flex: 1,
            padding: "2rem",
            background: "#f8f9fb",
            minHeight: "100vh",
          }}
        >
              <h2 style={{ marginBottom: "2rem", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 24 }}>
            <span>Edit Produk</span>
            {namaBarang && (
              <span style={{ fontWeight: 400, fontSize: 22, color: '#555' }}>
                {namaBarang}
              </span>
            )}
            <Button
              variant="contained"
              sx={{
                marginLeft: 'auto',
                background: "linear-gradient(90deg, #03ac0e 0%, #1abc9c 100%)",
                fontWeight: "bold",
                color: "white",
                height: 40,
                minWidth: 100,
                '&:hover': {
                  background: "linear-gradient(90deg, #02940c 0%, #16a085 100%)"
                }
              }}
              onClick={() => navigate('/manage-product')}
            >
              Back
            </Button>
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: 6 }}>Deskripsi Barang</label>
                <TextField
                  name="deskripsiBarang"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.deskripsiBarang}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                <TextField
                  label="Stok Barang"
                  name="stokBarang"
                  type="number"
                  fullWidth
                  value={formData.stokBarang}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Harga Barang"
                  name="hargaBarang"
                  type="number"
                  fullWidth
                  value={formData.hargaBarang}
                  onChange={handleChange}
                  required
                />
                <TextField
                  select
                  label="Kategori"
                  name="kategoriProduk"
                  fullWidth
                  value={formData.kategoriProduk}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="" disabled>Pilih kategori</MenuItem>
                  {kategoriOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <TextField
                  label="Diskon Produk (%)"
                  name="diskonProduk"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                  value={formData.diskonProduk}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #03ac0e 0%, #1abc9c 100%)",
                  fontWeight: "bold",
                  color: "white",
                  '&:hover': {
                    background: "linear-gradient(90deg, #02940c 0%, #16a085 100%)"
                  }
                }}
              >
                Simpan Perubahan
              </Button>

              {message && (
                <div style={{ marginTop: "1rem", color: message.includes("berhasil") ? "green" : "red" }}>
                  {message}
                </div>
              )}
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default UpdateProduct;
