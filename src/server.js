import express from "express";
import config_db from "./config/dotenv.js";
import userRoutes from "./routes/user.routes.js";
import imageRoutes from "./routes/images.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json()); // Middleware para JSON
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Servir imágenes

app.use("/api", userRoutes);
app.use("/api", imageRoutes); // Rutas de imágenes
app.use(errorHandler); // Middleware de errores

app.listen(config_db.port, () => {
	console.log(`🚀 Servidor corriendo en http://localhost:${config_db.port}`);
});
