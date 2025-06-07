import express from "express";
import {
	uploadImage,
	getAllImages,
	getASingleImage,
	getImagesByUser,
	getSearchedImages,
	deleteImage,
} from "../controllers/image.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadImage);
router.get("/", getAllImages);
router.get("/search", getSearchedImages);
router.get("/:id", getASingleImage);
router.get("/users/:user_id", getImagesByUser);
router.delete("/:id", authMiddleware, deleteImage);
router.post("");
export default router;
