// models/user.model.js
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const User = {
  create: async (first_name, last_name, username, email, password) => {
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

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows;
  },

  findByUsername: async (username) => {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows;
  },

  getImagesFavoritesByUser: async (user_id) => {
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

  getImagesLikesByUser: async (user_id) => {
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
