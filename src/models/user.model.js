import db from "../config/db.js";

export const User = {
	create: (first_name, last_name, username, email, password, callback) => {
		const query =
			"INSERT INTO users (first_name, last_name, username, email, password) VALUES (?,?,?, ?, ?)";
		db.query(
			query,
			[first_name, last_name, username, email, password],
			callback
		);
	},

	findByEmail: (email, callback) => {
		const query = "SELECT * FROM users WHERE email = ?";
		db.query(query, [email], callback);
	},
};
