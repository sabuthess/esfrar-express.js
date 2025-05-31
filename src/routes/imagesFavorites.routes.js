import express from "express";
import {
	addToFavorites,
	checkIfUserFavorite,
	getUserFavorites,
	removeFromFavorites,
} from "../controllers/imageFavorites.controller.js";

const router = express.Router();

router.post("/images/:id/favorite", addToFavorites);
router.delete("/images/:id/favorite", removeFromFavorites);

router.get("/images/favorites/users", getUserFavorites);
router.get("/images/:id/favorites/check", checkIfUserFavorite);

export default router;
