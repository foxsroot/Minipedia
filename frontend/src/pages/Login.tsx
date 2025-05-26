import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";

const fadeInUpTokopedia = {
  from: {
    opacity: 0,
    transform: "translateY(40px) scale(0.98)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { clearCart } = useCartContext();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/");
        clearCart();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="login-tokopedia-bg"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #03ac0e 0%, #56e39f 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          p: "2.5rem 2rem 2rem 2rem",
          width: "100%",
          maxWidth: 450,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0,
          transform: "translateY(40px) scale(0.98)",
          animation:
            "fadeInUpTokopedia 0.7s cubic-bezier(.23,1.01,.32,1) forwards",
          "@keyframes fadeInUpTokopedia": {
            "0%": {
              opacity: 0,
              transform: "translateY(40px) scale(0.98)",
            },
            "100%": {
              opacity: 1,
              transform: "translateY(0) scale(1)",
            },
          },
          // Responsive adjustments:
          "@media (max-width:500px)": {
            p: "1.5rem 0.7rem 1.2rem 0.7rem",
            maxWidth: "98vw",
          },
        }}
      >
        <Box
          sx={{
            mb: 1,
            textAlign: "center",
            fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
            color: "#03ac0e",
            fontSize: { xs: "1.5rem", sm: "2.3rem" },
            fontWeight: 800,
            letterSpacing: "1px",
            width: "100%",
            userSelect: "none",
          }}
          aria-label="MiniPedia Logo"
        >
          MiniPedia
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: "#222",
            fontSize: { xs: "1.05rem", sm: "1.25rem" },
            fontWeight: 600,
            mb: 3,
            textAlign: "center",
            width: "100%",
          }}
        >
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1.1rem",
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              sx: {
                bgcolor: "#f8f8f8",
                borderRadius: "8px",
                fontSize: "1rem",
                color: "#222",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 1.5,
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#03ac0e",
                },
              },
            }}
          />
          <Box sx={{ position: "relative", width: "100%" }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 0 }}
              InputProps={{
                sx: {
                  bgcolor: "#f8f8f8",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  color: "#222",
                  paddingRight: "2.5rem !important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 1.5,
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#03ac0e",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#03ac0e",
                    bgcolor: "#fff",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ pr: 0 }}>
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="start"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#03ac0e",
                        fontSize: "1.2rem",
                        "&:active": { color: "#02940c" },
                        background: "none",
                        border: "none",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                color: "#e53935",
                backgroundColor: "#fff3f3",
                border: "1px solid #ffcdd2",
                borderRadius: "6px",
                padding: "0.7rem 1rem",
                marginBottom: "0.5rem",
                fontSize: "0.98rem",
                textAlign: "center",
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              width: "100%",
              padding: "0.9rem 0",
              background: loading
                ? "#b2dfb4"
                : "linear-gradient(90deg, #03ac0e 60%, #56e39f 100%)",
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: 700,
              borderRadius: "8px",
              boxShadow: loading ? "none" : "0 2px 8px rgba(3, 172, 14, 0.08)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s, box-shadow 0.2s",
              "&:hover": {
                background: loading
                  ? "#b2dfb4"
                  : "linear-gradient(90deg, #02940c 60%, #3fd47e 100%)",
              },
            }}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </Box>
        <Box
          sx={{
            mt: 3,
            fontSize: "1rem",
            color: "#666",
            textAlign: "center",
            width: "100%",
          }}
        >
          Don't have an account?{" "}
          <MuiLink
            component={RouterLink}
            to="/register"
            sx={{
              color: "#03ac0e",
              fontWeight: 600,
              ml: 0.3,
              textDecoration: "none",
              "&:hover": { color: "#02940c" },
              cursor: "pointer",
            }}
          >
            Register
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
