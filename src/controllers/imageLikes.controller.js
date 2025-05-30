import { imageLikesModel } from "../models/imageLikes.model.js";

export const likeImage = (req, res) => {
	const image_id = req.params.id;
	const { user_id } = req.body;

	imageLikesModel.addLike(image_id, user_id, (err, result) => {
		if (err) {
			if (err.code === "ER_DUP_ENTRY") {
				return res
					.status(409)
					.json({ message: "Ya diste like a esta imagen." });
			}
			return res.status(500).json({ message: "Error al dar like." });
		}
		res.status(201).json({ message: "Like agregado correctamente." });
	});
};

export const dislikeImage = (req, res) => {
	const image_id = req.params.id;
	const { user_id } = req.body;

	imageLikesModel.removeLike(image_id, user_id, (err, result) => {
		if (err) {
			return res.status(500).json({ message: "Error al quitar like." });
		}
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Like no encontrado." });
		}
		res.json({ message: "Like removido correctamente." });
	});
};

export const getLikesCount = (req, res) => {
	const image_id = req.params.id;

	imageLikesModel.countLikes(image_id, (err, count) => {
		if (err) {
			return res
				.status(500)
				.json({ message: "Error al obtener cantidad de likes." });
		}
		res.json({ likes: count });
	});
};

export const checkIfUserLiked = (req, res) => {
	const image_id = req.params.id;
	const user_id = req.query.user_id; // o desde req.body según el caso

	imageLikesModel.hasUserLiked(image_id, user_id, (err, hasLiked) => {
		if (err) {
			return res
				.status(500)
				.json({ message: "Error al verificar like del usuario." });
		}
		res.json({ hasLiked });
	});
};
