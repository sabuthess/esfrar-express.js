import db from "../config/db.js";

export const imageLikesModel = {
	addLike: (image_id, user_id, callback) => {
		const sql = "INSERT INTO images_likes (image_id, user_id) VALUES (?, ?)";
		db.query(sql, [image_id, user_id], callback);
	},

	removeLike: (image_id, user_id, callback) => {
		const sql = "DELETE FROM images_likes WHERE image_id = ? AND user_id = ?";
		db.query(sql, [image_id, user_id], callback);
	},

	countLikes: (image_id, callback) => {
		const sql = "SELECT COUNT(*) AS likes FROM images_likes WHERE image_id = ?";
		db.query(sql, [image_id], (err, results) => {
			if (err) return callback(err);
			callback(null, results[0].likes);
		});
	},

	hasUserLiked: (image_id, user_id, callback) => {
		const sql = "SELECT * FROM images_likes WHERE image_id = ? AND user_id = ?";
		db.query(sql, [image_id, user_id], (err, results) => {
			if (err) return callback(err);
			callback(null, results.length > 0);
		});
	},
};
