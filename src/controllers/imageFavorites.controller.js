import { imageFavoritesModel } from "../models/imageFavorites.model.js";

export const addToFavorites = (req, res) => {
	const { user_id } = req.body;
	const image_id = req.params.id;

	if (!user_id || user_id === "undefined" || !image_id) {
		return res
			.status(401)
			.json({ error: "Debes estar logueado para añadir a favoritos." });
	}

	imageFavoritesModel.addFavorite(user_id, image_id, (err, results) => {
		if (err) {
			if (err.code === "ER_DUP_ENTRY") {
				return res.status(409).json({ message: "Ya está en favoritos" });
			}
			return res.status(500).json({ error: err.message });
		}
		res.status(201).json({ message: "Imagen añadida a favoritos" });
	});
};
export const getUserFavorites = (req, res) => {
	const { user_id } = req.query; // O req.params según cómo envíes

	if (!user_id) {
		return res.status(400).json({ error: "user_id es requerido" });
	}

	imageFavoritesModel.getFavoritesByUser(user_id, (err, results) => {
		if (err)
			return res
				.status(500)
				.json({ error: "Error al obtener las imágenes favoritas" });
		res.status(200).json(results);
	});
};

export const removeFromFavorites = (req, res) => {
	const image_id = req.params.id;
	const { user_id } = req.body;

	if (!user_id || !image_id) {
		return res.status(400).json({ error: "user_id e image_id son requeridos" });
	}

	imageFavoritesModel.removeFavorite(user_id, image_id, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(200).json({ message: "Imagen eliminada de favoritos" });
	});
};

export const checkIfUserFavorite = (req, res) => {
	const image_id = req.params.id;
	const user_id = req.query.user_id; // o desde req.body según el caso

	imageFavoritesModel.hasUserFavorite(image_id, user_id, (err, isFavorited) => {
		if (err) {
			return res
				.status(500)
				.json({ message: "Error al verificar like del usuario." });
		}
		res.json({ isFavorited });
	});
};
