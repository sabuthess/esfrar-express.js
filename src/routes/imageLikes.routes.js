import express from "express";
import {
	likeImage,
	dislikeImage,
	getLikesCount,
	checkIfUserLiked,
} from "../controllers/imageLikes.controller.js";

const router = express.Router();

router.post("/images/:id/like", likeImage);
router.delete("/images/:id/like", dislikeImage);
router.get("/images/:id/likes/count", getLikesCount);
router.get("/images/:id/likes/check", checkIfUserLiked);

export default router;
