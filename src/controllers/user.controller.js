import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const UserController = {
	registerUser: async (req, res) => {
		const { first_name, last_name, username, email, password } = req.body;

		if (!first_name || !last_name || !username || !email || !password) {
			return res
				.status(400)
				.json({ message: "Todos los campos son obligatorios" });
		}

		try {
			const [emailResults, usernameResults] = await Promise.all([
				User.findByEmail(email),
				User.findByUsername(username),
			]);

			if (emailResults.length > 0) {
				return res.status(400).json({ message: "El correo ya está registrado" });
			}

			if (usernameResults.length > 0) {
				return res
					.status(400)
					.json({ message: "El nombre de usuario ya está en uso" });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await User.create(first_name, last_name, username, email, hashedPassword);

			res.status(201).json({ message: "Usuario registrado correctamente" });
		} catch (err) {
			console.error("Error en el registro:", err);
			res.status(500).json({ error: "Error del servidor" });
		}
	},

	loginUser: async (req, res) => {
		const { email, password } = req.body;

		try {
			const results = await User.findByEmail(email);

			if (results.length === 0) {
				return res.status(401).json({ message: "Usuario no encontrado" });
			}

			const user = results[0];
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(401).json({ message: "Contraseña incorrecta" });
			}

			const token = jwt.sign(
				{ id: user.id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" }
			);

			res.json({ message: "¡Login exitoso!", token, user });
		} catch (err) {
			console.error("Error al iniciar sesión:", err);
			res.status(500).json({ message: "Error del servidor" });
		}
	},

	FindUserbyId: async (req, res) => {
		const { id } = req.params;

		try {
			const results = await User.findById(id);

			if (results.length === 0) {
				return res.status(404).json({ message: "Usuario no encontrado" });
			}

			const user = results[0];
			res.json({ message: "¡Usuario encontrado!", user });
		} catch (err) {
			console.error("Error al buscar usuario por ID:", err);
			res.status(500).json({ message: "Error del servidor" });
		}
	},

	FindByUsername: async (req, res) => {
		const { username } = req.params;

		try {
			const results = await User.findByUsername(username);

			if (results.length === 0) {
				return res
					.status(404)
					.json({ message: "Nombre de usuario no encontrado" });
			}

			const user = results[0];
			res.json({ message: "¡Nombre de usuario en uso!", user });
		} catch (err) {
			console.error("Error al buscar por username:", err);
			res.status(500).json({ message: "Error del servidor" });
		}
	},

	userProfile: (req, res) => {
		const token = req.headers["authorization"];

		if (!token) {
			return res.status(403).json({ message: "Token requerido" });
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(403).json({ message: "Token inválido" });
			}

			res.json({ message: "Acceso permitido", user: decoded });
		});
	},

	getUserFavorites: async (req, res) => {
		const user_id = req.user?.id;

		if (!user_id) {
			return res.status(400).json({ error: "user_id es requerido" });
		}

		try {
			const results = await imageFavoritesModel.getFavoritesByUser(user_id);
			res.status(200).json(results);
		} catch (err) {
			console.error("Error al obtener imágenes favoritas: ", err);
			res.status(500).json({ error: "Error al obtener las imágenes favoritas" });
		}
	},
	
	getUserLikes: async (req, res) => {
		const user_id = req.user?.id;

		if (!user_id) {
			return res.status(400).json({ error: "user_id es requerido" });
		}

		try {
			const results = await imageLikeModel.getLikesByUser(user_id);
			res.status(200).json(results);
		} catch (err) {
			console.error("Error las imagenes que me gustaron: ", err);
			res
				.status(500)
				.json({ error: "Error al obtener las imágenes que me gustaron" });
		}
	},
}