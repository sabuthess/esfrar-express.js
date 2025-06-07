import { imageLikeModel } from "../models/imageLikes.model.js";

export const addLike = async (req, res) => {
	const user_id = req.user?.id || req.body.user_id;
	const image_id = req.params.id;

	if (!user_id || !image_id) {
		return res.status(400).json({ error: "user_id e image_id son requeridos" });
	}

	try {
		await imageLikeModel.addLike(image_id, user_id);
		res.status(201).json({ message: "Like registrado" });
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(409).json({ message: "Ya diste like" });
		}
		console.error("Error en addLike:", error);
		res.status(500).json({ error: "Error al registrar el like" });
	}
};

export const removeLike = async (req, res) => {
	const user_id = req.user?.id || req.body.user_id;
	const image_id = req.params.id;

	if (!user_id || !image_id) {
		return res.status(400).json({ error: "user_id e image_id son requeridos" });
	}

	try {
		await imageLikeModel.removeLike(image_id, user_id);
		res.status(200).json({ message: "Like eliminado" });
	} catch (error) {
		console.error("Error en removeLike:", error);
		res.status(500).json({ error: "Error al eliminar el like" });
	}
};

export const checkIfUserLiked = async (req, res) => {
	const image_id = req.params.id;
	const user_id = req.user?.id || req.query.user_id;

	if (!user_id || !image_id) {
		return res.status(400).json({ error: "user_id e image_id son requeridos" });
	}

	try {
		const liked = await imageLikeModel.hasUserLiked(image_id, user_id);
		res.json({ hasLiked: liked });
	} catch (error) {
		console.error("Error en checkIfUserLiked:", error);
		res.status(500).json({ error: "Error al verificar like del usuario" });
	}
};

/* export const getLikeCount = async (req, res) => {
	const image_id = req.params.id;

	try {
		const count = await imageLikeModel.countLikes(image_id);
		res.json({ likeCount: count });
	} catch (error) {
		console.error("Error en getLikeCount:", error);
		res.status(500).json({ error: "Error al obtener likes" });
	}
}; */

export const getUserLikes = async (req, res) => {
	const user_id = req.user?.id;

	if (!user_id) {
		return res.status(400).json({ error: "user_id es requerido" });
	}

	try {
		const results = await imageLikeModel.getLikesByUser(user_id);
		res.status(200).json(results);
	} catch (err) {
		console.error("Error las imagenes que me gustaron: ", err);
		res
			.status(500)
			.json({ error: "Error al obtener las imágenes que me gustaron" });
	}
};
