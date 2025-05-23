import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #03ac0e 0%, #56e39f 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size={60}
        thickness={5}
        sx={{
          color: "#03ac0e",
          marginBottom: "1.5rem",
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "#e0e0e0",
          fontWeight: 600,
          letterSpacing: "1px",
          fontFamily: `'Poppins', 'Segoe UI', Arial, sans-serif`,
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
