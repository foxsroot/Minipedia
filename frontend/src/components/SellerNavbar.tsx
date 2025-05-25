import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Badge,
  Box,
  ButtonBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaRegUserCircle, FaShoppingCart } from "react-icons/fa";

type UserType = {
  name: string;
  avatar: string;
  notifications: number;
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

const SellerNavbar = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

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
          setUser({
            name: data.nama,
            avatar: data.avatar || "/default.png",
            notifications: data.notifications || 0,
          });
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

        <Box sx={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {!loading && !user ? (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <UserIconLink title="Login">
                <FaRegUserCircle size={22} />
              </UserIconLink>
            </Link>
          ) : (
            user && (
              <ButtonBase
                component={Link}
                to="/profile"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Badge badgeContent={user.notifications} color="error">
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    sx={{ width: 40, height: 40 }}
                  />
                </Badge>
                <UserName>{user.name}</UserName>
              </ButtonBase>
            )
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default SellerNavbar;