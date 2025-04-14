import mysql from "mysql2";
import config_db from "./dotenv.js"; // Importa las credenciales

const pool = mysql.createPool({
	host: config_db.db.host,
	user: config_db.db.user,
	password: config_db.db.password,
	database: config_db.db.database,
	connectTimeout: 10000,
});

pool.getConnection((err, connection) => {
	if (err) {
		console.error("❌ Error al conectar a MySQL:", err);
		process.exit(1);
	}
	console.log("✅ Conectado a MySQL (con pool)");
	connection.release(); // libera la conexión al pool
});

export default pool;
