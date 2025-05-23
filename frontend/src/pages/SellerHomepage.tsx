import SellerNavbar from "../components/SellerNavbar";
import SellerSidebar from "../components/SellerSidebar";
import { Line, Bar } from "@ant-design/charts";

// Dummy data for the past 7 days
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
const getDayLabel = (offset: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() - offset);
  return days[d.getDay()];
};

const data = Array.from({ length: 7 }).map((_, i) => ({
  day: getDayLabel(6 - i),
  sold: Math.floor(Math.random() * 20) + 10, // Dummy: 10-29 sold
  total: Math.floor(Math.random() * 100) + 50, // Dummy: 50-149 total
}));

const lineConfig = {
  data,
  xField: "day",
  yField: "sold",
  smooth: true,
  height: 250,
  color: "#03ac0e",
  point: { size: 5, shape: "diamond" },
  label: { style: { fill: "#03ac0e" } },
};

const barConfig = {
  data,
  xField: "day",
  yField: "total",
  height: 250,
  color: "#03ac0e",
  label: { position: "middle", style: { fill: "#fff" } },
};

const SellerHomepage = () => {
  return (
    <div>
      <SellerNavbar />
      <div style={{ display: "flex" }}>
        <SellerSidebar />
        <main style={{ flex: 1, padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24 }}>
            Seller Dashboard
          </h2>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 320, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(3,172,14,0.08)", padding: 24 }}>
              <h3 style={{ marginBottom: 16, color: "#03ac0e" }}>Products Sold (7 Days)</h3>
              <Line {...lineConfig} />
            </div>
            <div style={{ flex: 1, minWidth: 320, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(3,172,14,0.08)", padding: 24 }}>
              <h3 style={{ marginBottom: 16, color: "#03ac0e" }}>Total Products (7 Days)</h3>
              <Bar {...barConfig} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerHomepage;