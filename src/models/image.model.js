import db from "../config/db.js";

export const Image = {
	create: ({ filename, filepath }, callback) => {
		const sql = "INSERT INTO images (file_name, file_path) VALUES (?, ?)";
		db.query(sql, [filename, filepath], (err, result) => {
			if (err) return callback(err);
			callback(null, result);
		});
	},
	getAll: (callback) => {
		const sql = "SELECT * FROM images";
		db.query(sql, (err, results) => {
			if (err) return callback(err);
			callback(null, results);
		});
	},
};
