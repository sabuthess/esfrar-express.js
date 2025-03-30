import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
	const { first_name, last_name, username, email, password } = req.body;

	if (!first_name || !last_name || !username || !email || !password) {
		return res
			.status(400)
			.json({ error: "Todos los campos son obligatorios " });
	}

	User.findByEmail(email, async (err, results) => {
		if (results.length > 0) {
			return res.status(400).json({ error: "El usuario ya está registrado" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		User.create(
			first_name,
			last_name,
			username,
			email,
			hashedPassword,
			(err, result) => {
				if (err) console.log("Error al registrar el usuario:", err);
				return res.status(500).json({ error: "Error al registrar usuario" });
				res.status(201).json({ result: "Usuario registrado correctamente" });
			}
		);
	});
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	User.findByEmail(email, async (err, results) => {
		if (results.length === 0)
			return res.status(401).json({ message: "Usuario no encontrado" });

		const user = results[0];

		// Comparar la contraseña
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(401).json({ message: "Contraseña incorrecta" });

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		res.json({ message: "¡Login exitoso!", token, userId: user.id });
	});
};

export const userProfile = () => {
	const token = req.headers["authorization"];

	if (!token) return res.status(403).json({ message: "Token requerido" });

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.status(403).json({ message: "Token inválido" });
		res.json({ message: "Acceso permitido", user: decoded });
	});
};
