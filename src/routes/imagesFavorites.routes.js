import express from "express";
import {
	addToFavorites,
	checkIfUserFavorite,
	getUserFavorites,
	removeFromFavorites,
} from "../controllers/imageFavorites.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id/favorite", authMiddleware, addToFavorites);
router.delete("/:id/favorite", authMiddleware, removeFromFavorites);
router.get("/:id/favorite/check", authMiddleware, checkIfUserFavorite);
router.get("/user/:id/favorites", authMiddleware, getUserFavorites);

// router.get("/count/:imageId", getFavoriteCountController);
export default router;
