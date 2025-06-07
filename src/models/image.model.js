import db from "../config/db.js";

export const imageModel = {
	create: async ({ user_id, title, location, file_path, file_name, tags }) => {
		const sql = `
      INSERT INTO images (user_id, title, location, file_name, file_path, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
		const [result] = await db.query(sql, [
			user_id,
			title,
			location,
			file_name,
			file_path,
			tags,
		]);
		return result;
	},

	getAll: async () => {
		const [results] = await db.query("SELECT * FROM images");
		return results.map((img) => ({
			...img,
			file_path: `${process.env.BACKEND_URL}/uploads/${img.file_name}`,
		}));
	},

	getASingleImage: async (id) => {
		const [results] = await db.query("SELECT * FROM images WHERE id = ?", [id]);
		if (results.length === 0) return null;
		const image = results[0];
		return {
			...image,
			file_path: `${process.env.BACKEND_URL}/uploads/${image.file_name}`,
		};
	},

	getSearchedImages: async ({ search, limit, offset }) => {
		let query;
		let params;

		if (search && search.trim()) {
			query = `
        SELECT * FROM images
        WHERE LOWER(title) LIKE LOWER(?)
        OR LOWER(location) LIKE LOWER(?)
        OR LOWER(tags) LIKE LOWER(?)
        LIMIT ? OFFSET ?
      `;
			params = [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset];
		} else {
			query = "SELECT * FROM images LIMIT ? OFFSET ?";
			params = [limit, offset];
		}

		const [rows] = await db.query(query, params);
		return rows.map((img) => ({
			...img,
			file_path: `${process.env.BACKEND_URL}/uploads/${img.file_name}`,
		}));
	},

	countImages: async (search) => {
		let query;
		let params;

		if (search && search.trim()) {
			query = `
        SELECT COUNT(*) AS total FROM images
        WHERE LOWER(title) LIKE LOWER(?)
        OR LOWER(location) LIKE LOWER(?)
        OR LOWER(tags) LIKE LOWER(?)
      `;
			params = [`%${search}%`, `%${search}%`, `%${search}%`];
		} else {
			query = "SELECT COUNT(*) AS total FROM images";
			params = [];
		}

		const [[result]] = await db.query(query, params);
		return result.total;
	},

	getImagesByUser: async (user_id) => {
		const [results] = await db.query("SELECT * FROM images WHERE user_id = ?", [
			user_id,
		]);
		return results.map((img) => ({
			...img,
			file_path: `${process.env.BACKEND_URL}/uploads/${img.file_name}`,
		}));
	},

	deleteImage: async (image_id, user_id) => {
		const conn = await db.getConnection();
		try {
			await conn.beginTransaction();

			// Elimina likes asociados
			await conn.query("DELETE FROM images_likes WHERE image_id = ?", [
				image_id,
			]);

			// Elimina favoritos si tienes tabla así
			// await conn.query("DELETE FROM images_favorites WHERE image_id = ?", [image_id]);

			// Elimina la imagen
			const [result] = await conn.query(
				"DELETE FROM images WHERE id = ? AND user_id = ?",
				[image_id, user_id]
			);

			await conn.commit();
			return result.affectedRows > 0;
		} catch (error) {
			await conn.rollback();
			throw error;
		} finally {
			conn.release();
		}
	},
};
