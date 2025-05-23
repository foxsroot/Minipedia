import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const topMenu = [
  { name: "Homepage", path: "/seller-homepage", icon: <HomeIcon fontSize="small" /> },
];
const bottomMenu = [
  { name: "Manage Product", path: "/manage-product", icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { name: "Manage Order", path: "/manage-order", icon: <ShoppingCartOutlinedIcon fontSize="small" /> },
  { name: "Settings", path: "/update-toko", icon: <SettingsOutlinedIcon fontSize="small" /> },
];

const SellerSidebar = () => {
  const location = useLocation();
interface MenuItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

const renderMenu = (menu: MenuItem[]): React.ReactNode =>
    menu.map((item: MenuItem) => (
        <li key={item.path}>
            <Link
                to={item.path}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 32px",
                    color: location.pathname === item.path ? "#03ac0e" : "#222",
                    background: location.pathname === item.path ? "#e8f9ee" : "transparent",
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    borderRadius: "8px 0 0 8px",
                    textDecoration: "none",
                    marginBottom: 4,
                    transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#e0f7e9";
                    (e.currentTarget as HTMLElement).style.color = "#03ac0e";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background =
                        location.pathname === item.path ? "#e8f9ee" : "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                        location.pathname === item.path ? "#03ac0e" : "#222";
                }}
            >
                {item.icon}
                {item.name}
            </Link>
        </li>
    ));

  return (
    <aside
      style={{
        width: 240,
        background: "#f8f9fb",
        minHeight: "100vh",
        borderRight: "1.5px solid #e0e0e0",
        paddingTop: 32,
        boxSizing: "border-box",
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {renderMenu(topMenu)}
        </ul>
        <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", margin: "16px 0" }} />
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {renderMenu(bottomMenu)}
        </ul>
      </nav>
    </aside>
  );
};

export default SellerSidebar;