import express, { json } from "express";
import { sequelize } from "./models/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import barangRoutes from "./routes/barangRoutes";
import orderRoutes from "./routes/orderRoutes";
import tokoRouter from "./routes/tokoRoutes";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(json());

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Routes start
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/toko", tokoRouter);
// Routes end

app.use(errorHandler);

export default app;

// Only start the server if this file is run directly
if (require.main === module) {
    sequelize
        .sync()
        .then(() => {
            console.log("Database synced!");
            app.listen(process.env.PORT || 3000, () => {
                console.log("App started at port 3000");
            });
        })
        .catch((err) => {
            console.log("Failed to sync database:", err);
        });
}