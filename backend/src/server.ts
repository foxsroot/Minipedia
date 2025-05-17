import express, { json } from "express";
import { sequelize } from "./models/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";

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
app.use("/auth", authRoutes);
// Routes end

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log("App started at port 3000");
});