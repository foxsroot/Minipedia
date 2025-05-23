import { Link } from "react-router-dom";
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
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { FaSearch, FaRegUserCircle } from "react-icons/fa";

type UserType = { name: string; avatar: string; notifications: number };
const users: UserType[] = [
  { name: "John Doe", avatar: "/john.png", notifications: 5 },
  { name: "Jane Smith", avatar: "/jane.png", notifications: 0 },
];
const user = null as UserType | null;
// const user = users[1];

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
              <Badge badgeContent={user.notifications} color="error">
                <Avatar
                  alt={user.name}
                  src={user.avatar || "/default.png"}
                  sx={{ width: 40, height: 40 }}
                />
              </Badge>
              <UserName>{user.name}</UserName>
            </ButtonBase>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationBar;
