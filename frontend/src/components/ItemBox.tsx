import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface ItemBoxProps {
  imageUrl: string;
  title: string;
  price: number | string;
  discount?: string;
  onClick?: () => void;
}

const ItemBox: React.FC<ItemBoxProps> = ({
  imageUrl,
  title,
  price,
  discount,
  onClick,
}) => {
  return (
    <Box
      sx={{
        width: 240, // wider width
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          transform: "none",
        },
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={title}
        sx={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          mb: 1,
          backgroundColor: "#f5f5f5",
        }}
      />

      <Box sx={{ p: 1.5, flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          noWrap
          sx={{
            fontWeight: 600,
            mb: 0.5,
            color: "#222",
          }}
          title={title}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#03ac0e", mb: 1 }}
        >
          {typeof price === "number"
            ? price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })
            : price}
        </Typography>

        {discount && (
          <Typography
            variant="body2"
            sx={{
              color: "#d32f2f",
              fontWeight: 600,
              backgroundColor: "#fdecea",
              borderRadius: 1,
              px: 1,
              py: 0.25,
              display: "inline-block",
              mb: 1,
            }}
          >
            {discount}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{
            bgcolor: "#03ac0e",
            fontWeight: 700,
            "&:hover": { bgcolor: "#02940c" },
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
        >
          Buy Now
        </Button>
      </Box>
    </Box>
  );
};

export default ItemBox;
