import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";

const RegisterToko = () => {
  const [namaToko, setNamaToko] = useState("");
  const [lokasiToko, setLokasiToko] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/toko", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify({ namaToko, lokasiToko }),
      });
      if (response.ok) {
        setMessage("Toko berhasil didaftarkan!");
        setNamaToko("");
        setLokasiToko("");
        navigate("/seller-homepage"); // Redirect to home or another page after successful registration
      } else {
        const data = await response.json();
        setMessage(data.message || "Gagal mendaftarkan toko.");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan.");
    }
  };

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
            Daftarkan Toko Anda
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
            Daftar Toko
          </button>
          {message && (
            <div style={{ marginTop: "1rem", color: "#d32f2f" }}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterToko;