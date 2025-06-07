import express from "express";
import config_db from "./config/dotenv.js";
import userRoutes from "./routes/user.routes.js";
import imagesRoutes from "./routes/images.routes.js"; // imágenes
import likesRoutes from "./routes/imagesLikes.routes.js"; // likes
import favoritesRoutes from "./routes/imagesFavorites.routes.js"; // favoritos
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/images", likesRoutes); // Rutas de likes para imágenes
app.use("/api/images", favoritesRoutes); // Rutas de favoritos para imágenes

app.use(errorHandler); // Middleware de errores

app.listen(config_db.port, () => {
	console.log(
		`🚀 Servidor corriendo en ${process.env.DB_HOST}:${config_db.port}`
	);
});
