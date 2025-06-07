// models/user.model.js
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const User = {
	async create(first_name, last_name, username, email, password) {
		const userId = uuidv4();
		const query = `
      INSERT INTO users (id, first_name, last_name, username, email, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
		const [result] = await db.query(query, [
			userId,
			first_name,
			last_name,
			username,
			email,
			password,
		]);
		return result;
	},

	async findById(id) {
		const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
		return rows;
	},

	async findByEmail(email) {
		const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
			email,
		]);
		return rows;
	},

	async findByUsername(username) {
		const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
			username,
		]);
		return rows;
	},
};
