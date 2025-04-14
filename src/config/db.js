import mysql from "mysql2";
import config_db from "./dotenv.js"; // Importa las credenciales

const connection = await mysql.createConnection({
	host: config_db.db.host,
	user: config_db.db.user,
	password: config_db.db.password,
	database: config_db.db.database,
	connectTimeout: 10000,
});

connection.connect((err) => {
	if (err) {
		console.error("❌ Error al conectar a MySQL:", err);
		process.exit(1); // Detiene la app si la conexión falla
	}
	console.log("✅ Conectado a MySQL");
});

export default connection;
