import React, { useEffect, useState } from "react";
import SellerNavbar from "../components/SellerNavbar";
import SellerSidebar from "../components/SellerSidebar";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";

const ManageOrder = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const orderData = await res.json();
          setOrders(orderData || []); // Set the orders list
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAction = async (orderId: string, currentStatus: string) => {
    try {
      const nextStatus =
        currentStatus === "PACKED"
          ? "SHIPPED"
          : currentStatus === "SHIPPED"
          ? "DELIVERED"
          : currentStatus;

      const res = await fetch(`/api/orders/${orderId}/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ statusPengiriman: nextStatus }),
      });

      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, statusPengiriman: nextStatus }
              : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div>
      <SellerNavbar />
      <div style={{ display: "flex" }}>
        <SellerSidebar />
        <main style={{ flex: 1, padding: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              marginTop: 20,
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", margin: 0 }}>
              Orders Management
            </h2>
          </div>
          <TableContainer
            component={Paper}
            sx={{
              maxWidth: "100%",
              boxShadow: "none",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow
                  sx={{
                    background: "#f8f9fb",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #e0e0e0",
                      width: "4%",
                    }}
                  >
                    No
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #e0e0e0",
                      width: "20%",
                    }}
                  >
                    Nama Penerima
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #e0e0e0",
                      width: "20%",
                    }}
                  >
                    Alamat Pengiriman
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #e0e0e0",
                      width: "15%",
                    }}
                  >
                    Status Pengiriman
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #e0e0e0",
                      width: "15%",
                    }}
                  >
                    Nomor Resi
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, width: "15%" }}
                    align="left"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      Tidak ada pesanan.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order, idx) => (
                    <TableRow
                      key={order.orderId}
                      sx={{
                        "&:last-child td, &:last-child th": { borderBottom: 0 },
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        {order.namaPenerima}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        {order.alamatPengiriman}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        {order.statusPengiriman}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        {order.nomorResi || "-"}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color={
                            order.statusPengiriman === "PACKED"
                              ? "primary"
                              : order.statusPengiriman === "SHIPPED"
                              ? "success"
                              : "default"
                          }
                          size="small"
                          style={{ textTransform: "none" }}
                          disabled={order.statusPengiriman === "DELIVERED"}
                          onClick={() =>
                            handleAction(order.orderId, order.statusPengiriman)
                          }
                        >
                          {order.statusPengiriman === "PACKED"
                            ? "Kirim Produk"
                            : order.statusPengiriman === "SHIPPED"
                            ? "Delivered"
                            : "Completed"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>
    </div>
  );
};

export default ManageOrder;