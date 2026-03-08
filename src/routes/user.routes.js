import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", UserController.FindUserbyId);
router.get("/profile", UserController.userProfile);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get(
	"/user/:id/favorites",
	authMiddleware,
	UserController.getUserFavorites,
);
router.get("/user/:id/likes", authMiddleware, UserController.getUserLikes);

export default router;
