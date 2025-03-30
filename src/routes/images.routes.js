import express from "express";
import { getAllImages, uploadImage } from "../controllers/image.controller.js"; // Ajusta la ruta si es necesarioimport multer from "multer";

const router = express.Router();

router.post("/upload", uploadImage);

router.get("/images", getAllImages);

export default router;
