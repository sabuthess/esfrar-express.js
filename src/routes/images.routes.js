import express from "express";
import { ImageController} from "../controllers/image.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, ImageController.uploadImage);
router.get("/", ImageController.getAllImages);
router.get("/search", ImageController.getSearchedImages);
router.get("/:id", ImageController.getASingleImage);
router.get("/users/:user_id", ImageController.getImagesByUser);
router.delete("/:id", authMiddleware, ImageController.deleteImage);


// fovorites routes
router.post("/:id/favorite", authMiddleware, ImageController.addToFavorites);
router.delete("/:id/favorite", authMiddleware, rImageController.emoveFromFavorites);
router.get("/:id/favorite/check", authMiddleware, ImageController.checkIfUserFavorite);



// likes routes
router.post("/:id/like", authMiddleware, ImageController.addLike);
router.delete("/:id/like", authMiddleware, ImageController.removeLike);
router.get("/:id/likes/check", authMiddleware, ImageController.checkIfUserLiked);


export default router;
