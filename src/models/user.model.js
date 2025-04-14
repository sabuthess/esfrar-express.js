import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const userId = uuidv4();

export const User = {
	create: (first_name, last_name, username, email, password, callback) => {
		const query =
			"INSERT INTO users (id, first_name, last_name, username, email, password) VALUES (?,?,?,?,?,?)";
		db.query(
			query,
			[userId, first_name, last_name, username, email, password],
			callback
		);
	},

	findById: (id, callback) => {
		const query = "SELECT * from users WHERE id = ?";
		db.query(query, [id], callback);
	},

	findByEmail: (email, callback) => {
		const query = "SELECT * FROM users WHERE email = ?";
		db.query(query, [email], callback);
	},
};
