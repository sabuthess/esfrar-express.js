import express from "express";
import {
	FindUserbyId,
	loginUser,
	registerUser,
	userProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", FindUserbyId);
router.get("/profile", userProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
