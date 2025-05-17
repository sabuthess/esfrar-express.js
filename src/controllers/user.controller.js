import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Registro de usuario con verificación de username y email
export const registerUser = async (req, res) => {
	const { first_name, last_name, username, email, password } = req.body;

	if (!first_name || !last_name || !username || !email || !password) {
		return res
			.status(400)
			.json({ message: "Todos los campos son obligatorios" });
	}

	try {
		const [emailResults, usernameResults] = await Promise.all([
			User.findByEmailPromise(email),
			User.findByUsernamePromise(username),
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

		User.create(
			first_name,
			last_name,
			username,
			email,
			hashedPassword,
			(err, result) => {
				if (err) {
					console.error("Error al registrar el usuario:", err);
					return res.status(500).json({ error: "Error al registrar usuario" });
				}
				res.status(201).json({ message: "Usuario registrado correctamente" });
			}
		);
	} catch (err) {
		console.error("Error en el registro:", err);
		res.status(500).json({ error: "Error del servidor" });
	}
};

// Login de usuario
export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	User.findByEmail(email, async (err, results) => {
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
	});
};

// Buscar usuario por ID
export const FindUser = (req, res) => {
	const { id } = req.params;
	User.findById(id, (err, results) => {
		if (results.length === 0) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		const user = results[0];
		res.json({ message: "¡Usuario encontrado!", user });
	});
};

// Buscar usuario por nombre de usuario
export const FindByUsername = (req, res) => {
	const { username } = req.params;
	User.findByUsername(username, (err, results) => {
		if (results.length === 0) {
			return res
				.status(404)
				.json({ message: "Nombre de usuario no encontrado" });
		}
		const user = results[0];
		res.json({ message: "¡Nombre de usuario en uso!", user });
	});
};

// Obtener perfil del usuario usando JWT
export const userProfile = (req, res) => {
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
};
