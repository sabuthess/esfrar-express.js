import express from "express";
import {
	getAllImages,
	getASingleImage,
	uploadImage,
} from "../controllers/image.controller.js"; // Ajusta la ruta si es necesarioimport multer from "multer";

const router = express.Router();

router.post("/upload", uploadImage);

router.get("/images", getAllImages);

router.get("/images/:id", getASingleImage);

export default router;
