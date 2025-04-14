import express from "express";
import config_db from "./config/dotenv.js";
import userRoutes from "./routes/user.routes.js";
import imageRoutes from "./routes/images.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import path from "path";
import db from "./config/db.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoutes);
app.use("/api", imageRoutes);
app.use(errorHandler); // Middleware de errores

app.listen(config_db.port, () => {
	console.log(`🚀 Servidor corriendo en http://localhost:${config_db.port}`);
});
