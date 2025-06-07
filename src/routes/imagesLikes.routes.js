import express from "express";
import {
	addLike,
	removeLike,
	// getLikeCount,
	checkIfUserLiked,
	getUserLikes,
} from "../controllers/imageLikes.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id/like", authMiddleware, addLike);
router.delete("/:id/like", authMiddleware, removeLike);
router.get("/:id/likes/check", authMiddleware, checkIfUserLiked);
router.get("/user/:id/likes", authMiddleware, getUserLikes);

export default router;
