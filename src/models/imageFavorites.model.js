import db from "../config/db.js";

export const imageFavoritesModel = {
	addFavorite: (userId, image_id, callback) => {
		const query =
			"INSERT INTO images_favorites (user_id, image_id) VALUES (?, ?)";
		db.query(query, [userId, image_id], callback);
	},

	getFavoritesByUser: (userId, callback) => {
		const sql = `
    SELECT i.*
    FROM images_favorites f
    JOIN images i ON f.image_id = i.id
    WHERE f.user_id = ?
  `;

		db.query(sql, [userId], (err, results) => {
			if (err) {
				console.error("Error al obtener imágenes favoritas: ", err);
				callback(err, null);
			} else {
				// Si necesitas formar la URL completa del archivo:
				const images = results.map((image) => ({
					...image,
					file_path: `${process.env.BACKEND_URL}/uploads/${image.file_name}`, // O el campo correcto que tengas
				}));
				callback(null, images);
			}
		});
	},

	removeFavorite: (userId, imageId, callback) => {
		const query =
			"DELETE FROM images_favorites WHERE user_id = ? AND image_id = ?";
		db.query(query, [userId, imageId], callback);
	},
	hasUserFavorite: (image_id, user_id, callback) => {
		const sql =
			"SELECT * FROM images_favorites WHERE image_id = ? AND user_id = ?";
		db.query(sql, [image_id, user_id], (err, results) => {
			if (err) return callback(err);
			callback(null, results.length > 0);
		});
	},
};
