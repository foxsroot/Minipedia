import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Avatar,
  Badge,
  Box,
  ButtonBase,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FaSearch,
  FaRegUserCircle,
  FaShoppingCart,
} from "react-icons/fa";

import type { TokoDetail } from "../interfaces/Toko";

type UserType = {
  nama: string;
  userId: string;
  Toko: TokoDetail | null;
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#222",
  padding: "0.7rem 2.5rem",
  boxShadow: "0 2px 8px rgba(3,172,14,0.08)",
  borderBottom: "1.5px solid #e0e0e0",
  position: "sticky",
  top: 0,
  zIndex: 100,
}));

const Brand = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
  fontSize: "2rem",
  fontWeight: 800,
  color: "#03ac0e",
  letterSpacing: "1px",
  textDecoration: "none",
  marginRight: "1.2rem",
  "&:hover": {
    textShadow: "0 0 3px #03ac0e33",
    color: "#03ac0e",
  },
}));

const SearchBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  background: "#f6f7fb",
  borderRadius: "8px",
  padding: "0.2rem 0.7rem",
  minWidth: "320px",
  maxWidth: "600px",
  width: "100%",
  margin: "0 2rem",
  flexGrow: 1,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: "1rem",
  color: "#222",
  background: "transparent",
  padding: "0.6rem 0.5rem 0.6rem 0.2rem",
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  color: "#03ac0e",
  "&:hover": {
    color: "#02940c",
  },
}));

const UserIconLink = styled(IconButton)(({ theme }) => ({
  color: "#222",
  background: "#f6f7fb",
  borderRadius: "50%",
  padding: "0.45rem",
  fontSize: "1.2rem",
  transition: "background 0.2s, color 0.2s",
  "&:hover": {
    background: "#03ac0e22",
    color: "#03ac0e",
  },
}));

const UserName = styled("span")(({ theme }) => ({
  color: "#03ac0e",
  fontWeight: 600,
  fontSize: "1.08rem",
  marginLeft: "0.2rem",
  whiteSpace: "nowrap",
  letterSpacing: "0.2px",
  transition: "color 0.2s",
}));

const NavigationBar = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        const res = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("User data fetched:", data);
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Brand variant="h6">MiniPedia</Brand>
          </Link>
        </Box>

        <SearchBar>
          <SearchInput placeholder="Search in MiniPedia" />
          <SearchButton aria-label="Cari">
            <FaSearch />
          </SearchButton>
        </SearchBar>

        <Box sx={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <IconButton title="Cart" sx={{ color: "#222" }}>
            <Badge badgeContent={2} color="error">
              <FaShoppingCart size={20} />
            </Badge>
          </IconButton>

          {!loading && (
            user ? (
              user.Toko?.tokoId ? (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                  onClick={() => navigate("/seller-homepage")}
                >
                  Seller Dashboard
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                  onClick={() => navigate("/register-toko")}
                >
                  Register Toko
                </Button>
              )
            ) : (
              <Button
                variant="contained"
                color="success"
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            )
          )}

          {!user ? (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <UserIconLink title="Login">
                <FaRegUserCircle size={22} />
              </UserIconLink>
            </Link>
          ) : (
            <ButtonBase
              component={Link}
              to="/profile"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Avatar
                alt={user.nama}
                src={"/default.png"}
                sx={{ width: 40, height: 40 }}
              />
              <UserName>{user.nama}</UserName>
            </ButtonBase>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationBar;
