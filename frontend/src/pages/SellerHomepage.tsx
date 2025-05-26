import React, { useEffect, useState } from "react";
import SellerNavbar from "../components/SellerNavbar";
import SellerSidebar from "../components/SellerSidebar";
import { Line, Column } from "@ant-design/charts";

const SellerHomepage = () => {
  const [aggregatedData, setAggregatedData] = useState<
    { day: string; sold: number; revenue: number }[]
  >([]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/toko/current/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const orders = (data.orders || []).filter((order: any) => order.statusPengiriman === "DELIVERED");
          const tokoBarang = data.barang || [];
          const aggr = [];
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const label = days[d.getDay()];
            let sold = 0;
            let revenue = 0;
            orders.forEach((order: any) => {
              const orderDate = new Date(order.waktuTransaksi);
              if (
                orderDate.getFullYear() === d.getFullYear() &&
                orderDate.getMonth() === d.getMonth() &&
                orderDate.getDate() === d.getDate()
              ) {
                order.orderItems.forEach((item: any) => {
                  const quantity = item.jumlah ? Number(item.jumlah) : 1;
                  sold += quantity;
                  const price =
                    item.barang && item.barang.hargaBarang
                      ? Number(item.barang.hargaBarang)
                      : Number(
                        tokoBarang.find(
                          (b: any) => b.barangId === item.barangId
                        )?.hargaBarang
                      ) || 0;
                  revenue += quantity * price;
                });
              }
            });
            aggr.push({ day: label, sold, revenue });
          }
          setAggregatedData(aggr);
        } else {
          console.error("Failed to fetch toko orders data");
        }
      } catch (error) {
        console.error("Error fetching toko orders data:", error);
      }
    };

    fetchOrdersData();
  }, []);

  const lineConfig = {
    data: aggregatedData,
    xField: "day",
    yField: "sold",
    smooth: true,
    height: 250,
    color: "#03ac0e",
    point: { size: 5, shape: "diamond" },
    label: { style: { fill: "#03ac0e" } },
  };

  const barConfig = {
    data: aggregatedData,
    xField: "day",
    yField: "revenue",
    height: 250,
    color: "#03ac0e",
    label: {
      position: "middle",
      style: { fill: "#fff" },
      formatter: (datum: any) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(datum.revenue)
    }
  };

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
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(3,172,14,0.08)",
                padding: 24,
              }}
            >
              <h3 style={{ marginBottom: 16, color: "#03ac0e" }}>
                Products Sold (7 Days)
              </h3>
              <Line {...lineConfig} />
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(3,172,14,0.08)",
                padding: 24,
              }}
            >
              <h3 style={{ marginBottom: 16, color: "#03ac0e" }}>
                Total Revenue (7 Days)
              </h3>
              <Column {...barConfig} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerHomepage;