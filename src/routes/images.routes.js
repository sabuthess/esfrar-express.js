// image.router.js
import express from "express";
// import { uploadImage, getImages } from "../controllers/image.controller.js";
import { getImages, uploadImage } from "../controllers/image.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), uploadImage);
router.get("/images", getImages);

export default router;
