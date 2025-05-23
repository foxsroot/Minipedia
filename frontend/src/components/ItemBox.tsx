import React from "react";
import { Box, Typography } from "@mui/material";

interface ItemBoxProps {
  imageUrl: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stockLeft?: number;
  location?: string;
  rating?: number;
  sold?: number;
  storeName?: string;
  onClick?: () => void;
}

const convertTotalSold = (totalSold: number) => {
  if (totalSold < 100) return `${totalSold}`;
  const hundreds = Math.floor(totalSold / 100) * 100;
  const remainder = totalSold % 100;
  return remainder > 50 ? `${hundreds + 50}+` : `${hundreds}+`;
};

const ItemBox: React.FC<ItemBoxProps> = ({
  imageUrl,
  title,
  price,
  originalPrice,
  discount,
  stockLeft,
  location,
  rating,
  sold,
  storeName,
  onClick,
}) => {
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
          src={imageUrl}
          alt={title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
            filter: stockLeft === 0 ? "brightness(50%)" : "none",
          }}
        />
        {stockLeft !== undefined && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: stockLeft === 0 ? "#d32f2f" : "#fff",
              color: stockLeft === 0 ? "#fff" : "#d32f2f",
              fontWeight: 700,
              fontSize: "0.75rem",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {stockLeft === 0 ? "Stok Habis" : `${stockLeft} tersisa`}
          </Box>
        )}
        {discount && (
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
            {discount}%
          </Box>
        )}
      </Box>

      <Box
        sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ fontWeight: 600, color: "#222", mb: 0.5 }}
          title={title}
        >
          {title}
        </Typography>

        {originalPrice && discount ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: "#03ac0e",
                fontSize: "1rem",
              }}
            >
              {price
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
              {originalPrice
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
            {price
              .toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })
              .replace(",00", "")}
          </Typography>
        )}

        <Box sx={{ fontSize: "0.75rem", color: "#666", mb: 1 }}>
          {location && <div>{location}</div>}
          {rating && sold && (
            <div>
              ⭐ {rating} | {convertTotalSold(sold)} terjual
            </div>
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
          {storeName}
        </Typography>
      </Box>
    </Box>
  );
};

export default ItemBox;
