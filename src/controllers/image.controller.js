import { Image } from "../models/image.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Guarda en la carpeta 'uploads'
	},
	filename: (req, file, cb) => {
		const fileExtension = path.extname(file.originalname); // Obtiene la extensión
		const uniqueName = `${Date.now()}-${Math.round(
			Math.random() * 1e9
		)}${fileExtension}`;
		cb(null, uniqueName);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|gif/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);

		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error("Formato de archivo no válido. Solo se permiten imágenes."));
	},
});

// Middleware de subida de archivos
export const uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No se ha subido ninguna imagen" });
		}

		console.log("📂 Archivo recibido:", req.file);

		const filename = req.file.filename;
		const filepath = path.resolve("uploads", filename); // Guarda con ruta absoluta

		console.log("✅ Nombre del archivo guardado:", filename);
		console.log("📍 Ruta absoluta del archivo:", filepath);

		// Verificar si el archivo existe
		if (!fs.existsSync(filepath)) {
			console.error("❌ ERROR: El archivo no se guardó correctamente.");
			return res
				.status(500)
				.json({ error: "Error al guardar la imagen en el servidor" });
		}

		// Leer los primeros bytes del archivo para verificar si está corrupto
		fs.readFile(filepath, (err, data) => {
			if (err) {
				console.error("❌ Error al leer el archivo:", err);
				return res.status(500).json({ error: "Error al leer el archivo" });
			}
			console.log("🧐 Primeros bytes del archivo:", data.slice(0, 10));
		});

		// Guardar en la base de datos
		const newImage = new Image({ filename, filepath });
		await newImage.save();

		res
			.status(201)
			.json({ message: "Imagen subida correctamente", file: newImage });

		// Listar los archivos en uploads/
		fs.readdir("uploads", (err, files) => {
			if (err) {
				console.error("❌ Error al leer la carpeta uploads:", err);
			} else {
				console.log("📁 Archivos en uploads:", files);
			}
		});
	} catch (error) {
		console.error("🔥 Error en uploadImage:", error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};

// Obtener imágenes guardadas en la base de datos
export const getImages = async (req, res) => {
	try {
		const images = await Image.find();
		res.status(200).json(images);
	} catch (error) {
		console.error("🔥 Error en getImages:", error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};
