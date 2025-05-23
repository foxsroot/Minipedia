import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, phoneNumber, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Registration failed");
      } else {
        setSuccess(true);
        setEmail("");
        setUsername("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        background: "linear-gradient(135deg, #03ac0e 0%, #56e39f 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          maxWidth: 450,
          width: "100%",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          animation:
            "fadeInUpTokopedia 0.7s cubic-bezier(.23,1.01,.32,1) forwards",
          "@keyframes fadeInUpTokopedia": {
            "0%": { opacity: 0, transform: "translateY(40px) scale(0.98)" },
            "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#03ac0e",
            fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
            letterSpacing: 1,
            textAlign: "center",
            mb: 0.5,
          }}
        >
          MiniPedia
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#222",
            textAlign: "center",
            mb: 2,
          }}
        >
          Register
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          size="medium"
          sx={{
            bgcolor: "#f8f8f8",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="Username"
          variant="outlined"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          size="medium"
          sx={{
            bgcolor: "#f8f8f8",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="phoneNumber"
          variant="outlined"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          fullWidth
          size="medium"
          sx={{
            bgcolor: "#f8f8f8",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          size="medium"
          sx={{
            bgcolor: "#f8f8f8",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              paddingRight: "0 !important",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="start"
                  size="large"
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ color: "#03ac0e" }} />
                  ) : (
                    <Visibility sx={{ color: "#03ac0e" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          variant="outlined"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          size="medium"
          sx={{
            bgcolor: "#f8f8f8",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              paddingRight: "0 !important",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="start"
                  size="large"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff sx={{ color: "#03ac0e" }} />
                  ) : (
                    <Visibility sx={{ color: "#03ac0e" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ fontSize: "0.98rem" }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            variant="outlined"
            sx={{ fontSize: "0.98rem" }}
          >
            Registration successful! Redirecting...
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
          {loading ? "Loading..." : "Register"}
        </Button>

        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "#666", mt: 2 }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            sx={{
              color: "#03ac0e",
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": { color: "#02940c" },
              cursor: "pointer",
            }}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
