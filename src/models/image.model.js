import db from "../config/db.js";

export const imageModel = {
	create: (
		{ user_id, title, location, file_path, file_name, tags },
		callback
	) => {
		const sql =
			"INSERT INTO images (user_id, title, location, file_name, file_path, tags) VALUES ( ?, ?, ?, ?, ?, ?)";
		db.query(
			sql,
			[user_id, title, location, file_name, file_path, tags],
			(err, result) => {
				if (err) return callback(err);
				callback(null, result);
			}
		);
	},

	getAll: (callback) => {
		const sql = "SELECT * FROM images";

		db.query(sql, (err, results) => {
			if (err) return callback(err);

			// Aquí modificamos la ruta del file_path para devolver una URL completa
			const images = results.map((image) => ({
				...image,
				file_path: `${process.env.BACKEND_URL}/uploads/${image.file_name}`,
			}));

			callback(null, images);
		});
	},

	getASingleImage: (id, callback) => {
		const sql = "SELECT * FROM images WHERE id = ?";

		db.query(sql, [id], (err, results) => {
			if (!results || results.length === 0) {
				return callback(null, null); // o []
			}

			if (err) {
				console.error("Error al obtener la imagen: ", err);
				callback(err, null);
			} else {
				const image = results[0];
				const url = `${process.env.BACKEND_URL}/uploads/${image.file_name}`;

				callback(null, { url, ...image }); // Devuelve la primera fila que coincide con el id
			}
		});
	},

	getSearchedImages: async ({ search, limit, offset }) => {
		let query = "";
		let params = [];

		if (search && search.trim() !== "") {
			query = `
			SELECT * FROM images 
			WHERE LOWER(title) LIKE LOWER(?) 
			OR LOWER(location) LIKE LOWER(?)
			OR LOWER(tags) LIKE LOWER(?)
			LIMIT ? OFFSET ?
			`;
			params = [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset];
		} else {
			query = `
			SELECT * FROM images 
			LIMIT ? OFFSET ?
			`;
			params = [limit, offset];
		}

		const [rows] = await db.promise().query(query, params);

		const images = rows.map((image) => ({
			...image,
			file_path: `${process.env.BACKEND_URL}/uploads/${image.file_name}`,
		}));

		return images;
	},

	countImages: async (search) => {
		let query = "";
		let params = [];

		if (search && search.trim() !== "") {
			query = `
			SELECT COUNT(*) AS total FROM images 
			WHERE LOWER(title) LIKE LOWER(?) 
			OR LOWER(location) LIKE LOWER(?) 
			OR LOWER(tags) LIKE LOWER(?)
			
		  `;
			params = [`%${search}%`, `%${search}%`, `%${search}%`];
		} else {
			query = `SELECT COUNT(*) AS total FROM images`;
			params = [];
		}

		const [[result]] = await db.promise().query(query, params);
		return result.total;
	},

	getImagesByUser: (user_id, callback) => {
		const sql = "SELECT * FROM images WHERE user_id = ?";

		db.query(sql, [user_id], (err, results) => {
			if (err) {
				console.error("Error al obtener la imagen: ", err);
				callback(err, null);
			} else {
				const images = results.map((image) => ({
					...image,
					file_path: `${process.env.BACKEND_URL}/uploads/${image.file_name}`,
				}));

				callback(null, images);
			}
		});
	},

	deleteImage: (image_id, user_id, callback) => {
		const query = "DELETE FROM images WHERE id = ? AND user_id = ?";

		db.query(query, [image_id, user_id], (err, results) => {
			if (err) {
				return callback(err, null);
			}
			callback(null, "Imagen eliminada correctamente");
		});
	},

	likeImage: (image_id, user_id, callback) => {
		const query = "INSERT INTO images_likes (image_id, user_id) VALUES(?, ?)";

		db.query(query, [image_id, user_id], (err, result) => {
			if (err) {
				if (err.code === "ER_DUP_ENTRY") {
					return callback({
						status: 409,
						message: "Ya diste like a esta imagen",
					});
				}
				return callback(err);
			}
			callback(null, { message: "Like registrado" });
		});
	},

	getLikesByImageId: (image_id, callback) => {
		const query = `
		SELECT users.id, users.username, images_likes.created_at
		FROM images_likes
		JOIN users ON users.id = images_likes.user_id
		WHERE images_likes.image_id = ?
	`;

		db.query(query, [image_id], (err, results) => {
			if (err) return callback(err);
			callback(null, results);
		});
	},
};
