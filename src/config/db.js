import mysql from "mysql2/promise";
import config_db from "./dotenv.js";

const pool = mysql.createPool({
	host: config_db.db.host,
	user: config_db.db.user,
	password: config_db.db.password,
	database: config_db.db.database,
	waitForConnections: true,
	connectionLimit: 10,
	connectTimeout: 10000,
});

try {
	const connection = await pool.getConnection();
	console.log("✅ Conectado a MySQL (con pool)");
	connection.release();
} catch (err) {
	console.error("❌ Error al conectar a MySQL:", err);
	process.exit(1);
}

export default pool;
