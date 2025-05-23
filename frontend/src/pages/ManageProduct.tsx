import React, { useEffect, useState } from "react";
import SellerNavbar from "../components/SellerNavbar";
import SellerSidebar from "../components/SellerSidebar";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const ManageProduct = () => {
  const [barang, setBarang] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await fetch("/api/toko/owner", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const tokoData = await res.json();
          const toko = Array.isArray(tokoData) ? tokoData[0] : tokoData;
          setBarang(toko?.barang || []);
        } else {
          setBarang([]);
        }
      } catch {
        setBarang([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBarang();
  }, []);

  return (
    <div>
      <SellerNavbar />
      <div style={{ display: "flex" }}>
        <SellerSidebar />
        <main style={{ flex: 1, padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, marginTop: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", margin: 0 }}>
              Products Management
            </h2>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => navigate("/add-product")}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
            >
              Add Product
            </Button>
          </div>
          <TableContainer
            component={Paper}
            sx={{
              maxWidth: "100%",
              boxShadow: "none",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow
                  sx={{
                    background: "#f8f9fb",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #e0e0e0",
                      width: "4%",
                    }}
                  >
                    No
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #e0e0e0", width: "19%" }}>
                    Nama Barang
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #e0e0e0", width: "26%" }}>
                    Deskripsi
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #e0e0e0", width: "7%" }}>
                    Stok
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #e0e0e0", width: "15%" }}>
                    Harga
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #e0e0e0", width: "15%" }}>
                    Kategori
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "15%" }} align="left">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {barang.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      Tidak ada barang.
                    </TableCell>
                  </TableRow>
                ) : (
                  barang.map((b, idx) => (
                    <TableRow
                      key={b.barangId}
                      sx={{
                        "&:last-child td, &:last-child th": { borderBottom: 0 },
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>{idx + 1}</TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>{b.namaBarang}</TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>{b.deskripsiBarang}</TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>{b.stokBarang}</TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>{b.hargaBarang}</TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>{b.kategoriProduk}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          style={{ textTransform: "none" }}
                        >
                          Manage Barang
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>
    </div>
  );
};

export default ManageProduct;