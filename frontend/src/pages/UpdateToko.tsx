import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SellerSidebar from "../components/SellerSidebar";

const UpdateToko = () => {
  const [namaToko, setNamaToko] = useState("");
  const [lokasiToko, setLokasiToko] = useState("");
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
          const toko = Array.isArray(data) ? data[0] : data;
          setNamaToko(toko?.namaToko || "");
          setLokasiToko(toko?.lokasiToko || "");
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
        body: JSON.stringify({ namaToko, lokasiToko }),
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

  return (
    <div>
      <NavigationBar />
      <div style={{ display: "flex" }}>
        <SellerSidebar />
        <main style={{ flex: 1, padding: "2rem 0 2rem 2rem", background: "#f8f9fb", minHeight: "100vh" }}>
          <h2 style={{ marginBottom: "2rem", color: "black", textAlign: "left" }}>
            Update Toko Anda
          </h2>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="namaToko" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
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
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="lokasiToko" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
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
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  style={{
                    background: "#03ac0e",
                    color: "white",
                    padding: "0.75rem 2.5rem",
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
                  <div style={{ marginLeft: 16, color: "#d32f2f", alignSelf: "center" }}>{message}</div>
                )}
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default UpdateToko;