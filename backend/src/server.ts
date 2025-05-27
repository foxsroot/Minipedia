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
    origin: [process.env.CORS_ORIGIN || "http://172.16.202.254", "http://172.16.202.254:3000"],
    credentials: true,
}));
app.use(json());

app.use("/uploads", express.static(path.join(__dirname, "./uploads"), { 
    // Allow all origins to access files in /uploads
    setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
}));

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
            const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
            app.listen(port, '0.0.0.0', () => {
                console.log(`App started at port ${process.env.PORT}`);
            });
        })
        .catch((err) => {
            console.log("Failed to sync database:", err);
        });
}