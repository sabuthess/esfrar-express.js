import db from "../config/db.js";

export const imageLikeModel = {
	addLike: async (image_id, user_id) => {
		const sql = "INSERT INTO images_likes (image_id, user_id) VALUES (?, ?)";
		await db.query(sql, [image_id, user_id]);
	},

	removeLike: async (image_id, user_id) => {
		const sql = "DELETE FROM images_likes WHERE image_id = ? AND user_id = ?";
		await db.query(sql, [image_id, user_id]);
	},

	hasUserLiked: async (image_id, user_id) => {
		const [rows] = await db.query(
			"SELECT * FROM images_likes WHERE image_id = ? AND user_id = ?",
			[image_id, user_id]
		);
		return rows.length > 0;
	},

	/* countLikes: async (image_id) => {
		const [rows] = await db.query(
			"SELECT COUNT(*) AS count FROM images_likes WHERE image_id = ?",
			[image_id]
		);
		return rows[0].count;
	}, */

	getLikesByUser: async (user_id) => {
		const sql = `
      SELECT i.*
      FROM images_likes f
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
