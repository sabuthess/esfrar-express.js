import express from "express";
import {
	FindUser,
	loginUser,
	registerUser,
	userProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users/:id", FindUser);
router.get("/profile", userProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
