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
			[user_id, title, location, file_path, file_name, tags],
			(err, result) => {
				if (err) return callback(err);
				callback(null, result);
			}
		);
	},

	/* getAll: (callback) => {
		const sql = "SELECT * FROM images";
		db.query(sql, (err, results) => {
			if (err) return callback(err);
			callback(null, results);
		});
	},
};
 */
	getAll: (callback) => {
		const sql = "SELECT * FROM images";

		db.query(sql, (err, results) => {
			if (err) return callback(err);

			// Aquí modificamos la ruta del file_path para devolver una URL completa
			const images = results.map((image) => ({
				...image,
				file_path: `http://localhost:3500/uploads/${image.file_path}`, // URL completa
			}));

			callback(null, images);
		});
	},
};
