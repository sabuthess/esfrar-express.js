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

export const uploadImage = (req, res) => {
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
};

export const getAllImages = async (req, res) => {
	try {
		const results = await imageModel.getAll();
		res.status(200).json(results);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener las imágenes" });
	}
};

export const getASingleImage = async (req, res) => {
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
};

export const getSearchedImages = async (req, res) => {
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
};

export const getImagesByUser = async (req, res) => {
	const { user_id } = req.params;
	try {
		const results = await imageModel.getImagesByUser(user_id);
		res.status(200).json(results);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener imágenes del usuario" });
	}
};

export const deleteImage = async (req, res) => {
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
};

export const getImageById = async (req, res) => {
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
};
