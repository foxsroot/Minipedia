import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import type { Barang } from "../interfaces/Barang";

interface ItemBoxProps {
  idBarang: string;
  onClick?: () => void;
}

const convertTotalSold = (totalSold: number) => {
  if (totalSold < 100) return `${totalSold}`;
  const hundreds = Math.floor(totalSold / 100) * 100;
  const remainder = totalSold % 100;
  return remainder > 50 ? `${hundreds + 50}+` : `${hundreds}+`;
};

const ItemBox: React.FC<ItemBoxProps> = ({ idBarang, onClick }) => {
  const [barang, setBarang] = useState<Barang>();

  const hargaDiskon = (hargaAwal: number) => {
    if (barang?.diskonProduk) {
      return hargaAwal - (hargaAwal * barang.diskonProduk) / 100;
    }
    return hargaAwal;
  };

  const fetchToko = async (idBarang: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/barang/${idBarang}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch toko");

      const data = await response.json();

      setBarang(data);
    } catch (error) {
      console.error("Error fetching toko:", error);
    }
  };

  useEffect(() => {
    fetchToko(idBarang);
  }, []);

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      <Box sx={{ position: "relative", width: "100%", height: 180 }}>
        <Box
          component="img"
          src={barang?.fotoBarang}
          alt={barang?.namaBarang}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
            filter: barang?.stokBarang === 0 ? "brightness(50%)" : "none",
          }}
        />
        {barang?.stokBarang !== undefined && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: barang?.stokBarang === 0 ? "#d32f2f" : "#fff",
              color: barang?.stokBarang === 0 ? "#fff" : "#d32f2f",
              fontWeight: 700,
              fontSize: "0.75rem",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {barang?.stokBarang === 0
              ? "Stok Habis"
              : `${barang?.stokBarang} tersisa`}
          </Box>
        )}
        {barang?.diskonProduk && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#ff5e8b",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.75rem",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {barang?.diskonProduk}%
          </Box>
        )}
      </Box>

      <Box
        sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="subNamaItem2"
          noWrap
          sx={{ fontWeight: 600, color: "#222", mb: 0.5 }}
          namaBarang={barang?.namaBarang}
        >
          {barang?.namaBarang}
        </Typography>

        {barang?.hargaBarang && barang?.diskonProduk ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: "#03ac0e",
                fontSize: "1rem",
              }}
            >
              {hargaDiskon(barang.hargaBarang)
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })
                .replace(",00", "")}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                textDecoration: "line-through",
                color: "#888",
                fontSize: "0.75rem",
              }}
            >
              {barang?.hargaBarang
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })
                .replace(",00", "")}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#03ac0e",
              mb: 1,
              fontSize: "1rem",
            }}
          >
            {barang?.hargaBarang
              .toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })
              .replace(",00", "")}
          </Typography>
        )}

        <Box sx={{ fontSize: "0.75rem", color: "#666", mb: 1 }}>
          {barang?.toko.lokasiToko && <div>{barang?.toko.lokasiToko}</div>}
          {barang?.jumlahTerjual && (
            <div>{convertTotalSold(barang?.jumlahTerjual)} terjual</div>
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: "#555",
            fontWeight: 500,
            mt: "auto",
          }}
        >
          {barang?.toko.namaToko}
        </Typography>
      </Box>
    </Box>
  );
};

export default ItemBox;
