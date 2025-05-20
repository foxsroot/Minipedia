import express, { json } from "express";
import { sequelize } from "./models/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import barangRoutes from "./routes/barangRoutes";
import notifikasiRoutes from "./routes/notifikasiRoutes";
import orderRoutes from "./routes/orderRoutes";
import laporanRoutes from "./routes/laporanRoutes";
import tokoRouter from "./routes/tokoRoutes";

const app = express();

sequelize
    .sync()
    .then(() => {
        console.log("Database synced!");
    })
    .catch((err) => {
        console.log("Failed to sync database:", err);
    });

app.use(json());

// Routes start
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/notifikasi", notifikasiRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/toko", tokoRouter);
// Routes end

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log("App started at port 3000");
});