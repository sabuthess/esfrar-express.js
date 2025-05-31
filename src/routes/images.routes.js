import express from "express";
import {
	deleteImage,
	getAllImages,
	getASingleImage,
	getImagesByUser,
	getSearchedImages,
	uploadImage,
} from "../controllers/image.controller.js";

const router = express.Router();

router.post("/upload", uploadImage);

router.get("/images", getAllImages);
router.get("/images/search", getSearchedImages);
router.get("/images/:id", getASingleImage);
router.get("/images/users/:user_id", getImagesByUser);
router.delete("/images/:id", deleteImage);

export default router;
