/* import { Image } from "../models/image.model.js";
 */ import multer from "multer";
import { imageModel } from "../models/image.model.js";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (req, file, cb) => {
		const ext = file.originalname.split(".").pop();
		cb(null, `${Date.now()}.${ext}`);
	},
});

const upload = multer({ storage });

//

export const uploadImage = (req, res) => {
	upload.single("file")(req, res, (err) => {
		if (err) {
			return res
				.status(500)
				.json({ message: "Error al subir la imagen", error: err });
		}

		if (!req.file) {
			return res
				.status(400)
				.json({ message: "No se ha subido ninguna imagen" });
		}

		// Verificar los datos recibidos

		console.log(req.body);

		const { user_id, title, location, tags } = req.body;

		const file_path = `uploads/${req.file.filename}`;
		const file_name = req.file.filename;

		// Si tags es una cadena, lo convertimos a un array de etiquetas

		// Verificar los datos antes de insertar
		console.log("Datos a guardar en la base de datos:", {
			user_id,
			title,
			location,
			file_path,
			file_name,
			tags,
		});

		imageModel.create(
			{ user_id, title, location, file_path, file_name, tags: tags },
			(err, result) => {
				if (err) {
					console.log("Error al guardar en la base de datos:", err);
					return res
						.status(500)
						.json({ error: "Error al guardar la imagen en la base de datos" });
				}

				res.status(200).json({
					message: "Imagen subida y guardada correctamente",
					image: result,
				});
			}
		);
	});
};

export const getAllImages = (req, res) => {
	return imageModel.getAll((err, results) => {
		if (err) {
			return res.status(500).json({ error: "Error al obtener las imágenes" });
		}
		res.status(200).json(results);
	});
};

export const getASingleImage = (req, res) => {
	const { id } = req.params;

	return imageModel.getASingleImage(id, (err, result) => {
		if (err) {
			return res
				.status(500)
				.json({ error: "Error al treaer la imagen de la db" });
		}
		if (!result) {
			return res.status(404).json({ message: "Imagen no encontrada" });
		}

		res.status(200).json(result);
	});
};

export const getSearchedImages = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const offset = (page - 1) * limit;
	const search = req.query.search;

	console.log("🟡 Recibida búsqueda con:", { search, page, limit });

	try {
		const rows = await imageModel.getSearchedImages({ search, limit, offset });
		console.log("🟢 Imágenes encontradas:", rows.length);

		const total = await imageModel.countImages(search);
		console.log("📊 Total imágenes:", total);

		res.json({
			data: rows,
			total,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error("🔴 Error en getSearchedImages:", error);
		res.status(500).json({ error: "Error al obtener imágenes" });
	}
};

export const getImagesByUser = async (req, res) => {
	const { user_id } = req.query;
	// const  user_id  = req.params.user_id;

	return imageModel.getImagesByUser(user_id, (err, results) => {
		if (err) {
			return res.status(500).json({ error: "Error al obtener las imágenes" });
		}
		res.status(200).json(results);
	});
};

export const deleteImage = (req, res) => {
	const { user_id, image_id } = req.body;

	return imageModel.deleteImage(image_id, user_id, (err, results) => {
		if (err) return res.status(500).json({ error: "Error del servidor" });

		res.json({ message: "Imagen eliminada correctamente" });
	});
};
