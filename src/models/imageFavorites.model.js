import db from "../config/db.js";

export const imageFavoritesModel = {
	addFavorite: async (image_id, user_id) => {
		const sql =
			"INSERT INTO images_favorites (image_id, user_id) VALUES (?, ?)";

		try {
			// Ejecuta la consulta
			await db.query(sql, [image_id, user_id]);
			console.log("Imagen agregada a favoritos exitosamente");
		} catch (error) {
			console.error("Error al agregar imagen a favoritos:", error);
			throw new Error("No se pudo agregar la imagen a favoritos");
		}
	},

	removeFavorite: async (image_id, user_id) => {
		const sql =
			"DELETE FROM images_favorites WHERE image_id = ? AND user_id = ?";
		await db.query(sql, [image_id, user_id]);
	},

	hasUserFavorite: async (image_id, user_id) => {
		const [rows] = await db.query(
			"SELECT * FROM images_favorites WHERE image_id = ? AND user_id = ?",
			[image_id, user_id]
		);
		return rows.length > 0;
	},
	/* 
	getFavoriteCount: async (image_id) => {
		const [rows] = await db.query(
			"SELECT COUNT(*) AS count FROM images_favorites WHERE image_id = ?",
			[image_id]
		);
		return rows[0].count;
	},
 */
	getFavoritesByUser: async (user_id) => {
		const sql = `
      SELECT i.*
      FROM images_favorites f
      JOIN images i ON f.image_id = i.id
      WHERE f.user_id = ?
    `;
		const [results] = await db.query(sql, [user_id]);
		return results.map((img) => ({
			...img,
			file_path: `${process.env.BACKEND_URL}/uploads/${img.file_name}`,
		}));
	},
};
