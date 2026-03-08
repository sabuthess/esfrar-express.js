import multer from "multer";
import { imageModel } from "../models/image.model.js";
import { imageFavoritesModel } from "../models/imageFavorites.model.js";

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "./uploads"),
	filename: (req, file, cb) => {
		const ext = file.originalname.split(".").pop();
		cb(null, `${Date.now()}.${ext}`);
	},
});
const upload = multer({ storage });

export const ImageController = {
	uploadImage: async (req, res) => {
		upload.single("file")(req, res, async (err) => {
			if (err)
				return res
					.status(500)
					.json({ message: "Error al subir la imagen", error: err });
			if (!req.file)
				return res
					.status(400)
					.json({ message: "No se ha subido ninguna imagen" });

			const { user_id, title, location, tags } = req.body;
			const file_path = `uploads/${req.file.filename}`;
			const file_name = req.file.filename;

			try {
				const result = await imageModel.create({
					user_id,
					title,
					location,
					file_path,
					file_name,
					tags,
				});
				res
					.status(200)
					.json({ message: "Imagen subida correctamente", image: result });
			} catch (error) {
				res.status(500).json({ error: "Error al guardar la imagen" });
			}
		});
	},

	getAllImages: async (req, res) => {
		try {
			const results = await imageModel.getAll();
			res.status(200).json(results);
		} catch (error) {
			res.status(500).json({ error: "Error al obtener las imágenes" });
		}
	},

	getASingleImage: async (req, res) => {
		const { id } = req.params;
		try {
			const result = await imageModel.getASingleImage(id);
			if (!result)
				return res.status(404).json({ message: "Imagen no encontrada" });
			res.status(200).json(result);
		} catch (error) {
			console.error("Error en getASingleImage:", error);
			res.status(500).json({ error: "Error al obtener la imagen" });
		}
	},

	getSearchedImages: async (req, res) => {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;
		const search = req.query.search;

		try {
			const rows = await imageModel.getSearchedImages({ search, limit, offset });
			const total = await imageModel.countImages(search);
			res.json({
				data: rows,
				total,
				currentPage: page,
				totalPages: Math.ceil(total / limit),
			});
		} catch (error) {
			res.status(500).json({ error: "Error al obtener imágenes" });
		}
	},

	getImagesByUser: async (req, res) => {
		const { user_id } = req.params;
		try {
			const results = await imageModel.getImagesByUser(user_id);
			res.status(200).json(results);
		} catch (error) {
			res.status(500).json({ error: "Error al obtener imágenes del usuario" });
		}
	},

	deleteImage: async (req, res) => {
		const { user_id } = req.body;
		const { id: image_id } = req.params;
		console.log(req.body);
		try {
			const deleted = await imageModel.deleteImage(image_id, user_id);
			if (!deleted)
				return res.status(404).json({ message: "No se pudo eliminar la imagen" });
			res.json({ message: "Imagen eliminada correctamente" });
		} catch (error) {
			res.status(500).json({ error: "Error del servidor" });
		}
	},

	getImageById: async (req, res) => {
		const imageId = req.params.id;
		const userId = req.user?.id;

		try {
			const [rows] = await db.query("SELECT * FROM images WHERE id = ?", [
				imageId,
			]);

			if (rows.length === 0) {
				return res.status(404).json({ message: "Imagen no encontrada" });
			}

			const image = rows[0];

			const isFavorited = userId
				? await imageFavoritesModel.hasUserFavorite(imageId, userId)
				: false;

			res.status(200).json({ ...image, isFavorited });
		} catch (error) {
			console.error("Error al obtener la imagen:", error);
			res.status(500).json({ message: "Error interno del servidor" });
		}
	},

	addToFavorites: async (req, res) => {
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
	},

	removeFromFavorites: async (req, res) => {
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




	},

	checkIfUserFavorite: async (req, res) => {
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
	},

	addLike: async (req, res) => {
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
	},

	removeLike: async (req, res) => {
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
	},
	
	checkIfUserLiked: async (req, res) => {
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
	}
	,
}








