import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";

const UpdateToko = () => {
  const [namaToko, setNamaToko] = useState("");
  const [lokasiToko, setLokasiToko] = useState("");
  const [statusToko, setStatusToko] = useState<"Active" | "Inactive">("Active");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToko = async () => {
      try {
        const response = await fetch(`/api/toko/owner`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // getCurrentUserTokos returns an array, use the first toko
          const toko = Array.isArray(data) ? data[0] : data;
          setNamaToko(toko?.namaToko || "");
          setLokasiToko(toko?.lokasiToko || "");
          setStatusToko(toko?.statusToko === "Inactive" ? "Inactive" : "Active");
        } else {
          setMessage("Gagal mengambil data toko.");
        }
      } catch {
        setMessage("Terjadi kesalahan saat mengambil data toko.");
      } finally {
        setLoading(false);
      }
    };
    fetchToko();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/toko`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ namaToko, lokasiToko, statusToko }),
      });
      if (response.ok) {
        setMessage("Toko berhasil diupdate!");
      } else {
        const data = await response.json();
        setMessage(data.message || "Gagal mengupdate toko.");
      }
    } catch {
      setMessage("Terjadi kesalahan.");
    }
  };

  if (loading) {
    return (
      <div className="home-tokopedia-bg" style={{ minHeight: "100vh" }}>
        <NavigationBar />
        <div className="home-tokopedia-content" style={{
          display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="home-tokopedia-bg" style={{ minHeight: "100vh" }}>
      <NavigationBar />
      <div
        className="home-tokopedia-content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: "2rem 2.5rem",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            minWidth: "320px",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#03ac0e" }}>
            Update Toko Anda
          </h2>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="namaToko" style={{ display: "block", marginBottom: 4 }}>
              Nama Toko
            </label>
            <input
              id="namaToko"
              type="text"
              value={namaToko}
              onChange={(e) => setNamaToko(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="lokasiToko" style={{ display: "block", marginBottom: 4 }}>
              Lokasi Toko
            </label>
            <input
              id="lokasiToko"
              type="text"
              value={lokasiToko}
              onChange={(e) => setLokasiToko(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              Status Toko
            </label>
            <div>
              <label style={{ marginRight: "1rem" }}>
                <input
                  type="radio"
                  name="statusToko"
                  value="Active"
                  checked={statusToko === "Active"}
                  onChange={() => setStatusToko("Active")}
                  style={{ marginRight: 4 }}
                />
                Active
              </label>
              <label>
                <input
                  type="radio"
                  name="statusToko"
                  value="Inactive"
                  checked={statusToko === "Inactive"}
                  onChange={() => setStatusToko("Inactive")}
                  style={{ marginRight: 4 }}
                />
                Inactive
              </label>
            </div>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#03ac0e",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Update Toko
          </button>
          {message && (
            <div style={{ marginTop: "1rem", color: "#d32f2f" }}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateToko;