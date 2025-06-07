import { imageFavoritesModel } from "../models/imageFavorites.model.js";

export const addToFavorites = async (req, res) => {
	const user_id = req.user?.id || req.body.user_id;
	const image_id = req.params.id;

	if (!user_id || !image_id) {
		return res.status(400).json({ error: "user_id e image_id son requeridos" });
	}

	try {
		await imageFavoritesModel.addFavorite(image_id, user_id);
		res.status(201).json({ message: "Añadido a favoritos" });
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(409).json({ message: "Ya diste a favoritos" });
		}
		console.error("Error en addFavorite:", error);
		res.status(500).json({ error: "Error al añadir a favoritos" });
	}
};

export const removeFromFavorites = async (req, res) => {
	const image_id = req.params.id;
	const user_id = req.user?.id || req.body.user_id;

	if (!user_id || !image_id) {
		return res.status(400).json({ error: "user_id e image_id son requeridos" });
	}
	try {
		await imageFavoritesModel.removeFavorite(image_id, user_id);
		res.status(200).json({ message: "Quitado de favoritos" });
	} catch (error) {
		console.error("Error en removeFromFavorites:", error);
		res.status(500).json({ error: "Error al quitar de favoritos" });
	}
};

export const checkIfUserFavorite = async (req, res) => {
	const image_id = req.params.id;
	const user_id = req.user?.id || req.query.user_id;

	if (!user_id || !image_id) {
		return res.status(400).json({ error: "user_id e image_id son requeridos" });
	}

	try {
		const favorited = await imageFavoritesModel.hasUserFavorite(
			image_id,
			user_id
		);
		res.json({ hasFavorite: favorited });
	} catch (error) {
		console.error("Error en checkIfUserFavorite:", error);
		res.status(500).json({ error: "Error al verificar favorito del usuario" });
	}
};

/* export const getFavoriteCountController = async (req, res) => {
	try {
		const { imageId } = req.params;
		const count = await imageFavoritesModel.getFavoriteCount(imageId);
		res.json({ imageId, favorites: count });
	} catch (err) {
		console.error("Error obteniendo cantidad de favoritos:", err);
		res.status(500).json({ message: "Error interno del servidor" });
	}
}; */

export const getUserFavorites = async (req, res) => {
	const user_id = req.user?.id;

	if (!user_id) {
		return res.status(400).json({ error: "user_id es requerido" });
	}

	try {
		const results = await imageFavoritesModel.getFavoritesByUser(user_id);
		res.status(200).json(results);
	} catch (err) {
		console.error("Error al obtener imágenes favoritas: ", err);
		res.status(500).json({ error: "Error al obtener las imágenes favoritas" });
	}
};
