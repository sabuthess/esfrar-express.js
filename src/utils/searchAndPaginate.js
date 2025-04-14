export const searchAndPaginate = (db) => {
	return (req, res) => {
		const { page = 1, limit = 10, search = "" } = req.query;
		console.log("Búsqueda recibida:", search); // Verifica el valor de la búsqueda

		const currentPage = parseInt(page, 10);
		const limitNum = parseInt(limit, 10);
		const offset = (currentPage - 1) * limitNum;

		const trimmedSearch = search.trim().toLowerCase(); // Aseguramos que todo esté en minúsculas

		// Dependiendo si hay búsqueda o no
		let countQuery, dataQuery, paramsCount, paramsData;

		if (trimmedSearch) {
			const searchValue = `%${trimmedSearch}%`;

			// Consulta de conteo de resultados
			countQuery = `
                SELECT COUNT(*) as total 
                FROM images 
                WHERE LOWER(title) LIKE ? OR LOWER(tags) LIKE ?
            `;

			// Consulta de datos paginados
			dataQuery = `
                SELECT * 
                FROM images 
                WHERE LOWER(title) LIKE ? OR LOWER(tags) LIKE ? 
                LIMIT ? OFFSET ?
            `;

			paramsCount = [searchValue, searchValue];
			paramsData = [searchValue, searchValue, limitNum, offset];
		} else {
			// Si no hay búsqueda, devuelve todos los resultados
			countQuery = `SELECT COUNT(*) as total FROM images`;
			dataQuery = `SELECT * FROM images LIMIT ? OFFSET ?`;

			paramsCount = [];
			paramsData = [limitNum, offset];
		}

		// Verifica la consulta antes de ejecutarla
		console.log("countQuery:", countQuery);
		console.log("paramsCount:", paramsCount);
		console.log("dataQuery:", dataQuery);
		console.log("paramsData:", paramsData);

		// Total de resultados
		db.query(countQuery, paramsCount, (err, countResult) => {
			if (err) {
				console.error("Error al contar registros:", err);
				return res.status(500).json({ error: "Error al contar registros" });
			}

			const total = countResult[0].total;
			const totalPages = Math.ceil(total / limitNum);

			// Datos paginados
			db.query(dataQuery, paramsData, (err, results) => {
				if (err) {
					console.error("Error al obtener resultados:", err);
					return res.status(500).json({ error: "Error al obtener resultados" });
				}

				console.log("Resultados encontrados:", results); // Verifica los resultados

				res.json({
					page: currentPage,
					limit: limitNum,
					search: trimmedSearch,
					total,
					totalPages,
					data: results,
				});
			});
		});
	};
};
