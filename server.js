// server.js

// 1. Cargar dependencias
require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const { Client } = require("@notionhq/client");

// 2. Inicializar Express y obtener la configuración
const app = express();
const PORT = process.env.PORT || 3001; // El puerto del backend

// Obtener las variables de entorno
const NOTION_DATABASE_ID = process.env.DB_ID;
const NOTION_TOKEN = process.env.TOKEN_NOTION;

// 3. Inicializar el cliente de Notion
const notion = new Client({ auth: NOTION_TOKEN });

// 4. Configurar Middleware (para aceptar JSON)
app.use(express.json());

// 5. Definir la ruta de la API para consultar la DB
app.get("/api/notion/items", async (req, res) => {
  // Validar si el ID de la base de datos está disponible
  if (!NOTION_DATABASE_ID) {
    return res.status(500).json({
      error: "DB_ID no está configurado en las variables de entorno.",
    });
  }

  try {
    // Consultar la base de datos de Notion
    const response = await notion.dataSources.query({
      data_source_id: NOTION_DATABASE_ID,
      // Puedes añadir aquí filtros y ordenaciones si los necesitas
      // Por ejemplo: sort: [{ property: 'Nombre', direction: 'ascending' }]
    });

    // NOTA: La respuesta de Notion es muy detallada.
    // En una aplicación real, deberías mapear y simplificar 'response.results'.

    // Simplemente devolvemos los resultados (las páginas/ítems)
    res.json({ results: response.results });
  } catch (error) {
    console.error("Error al consultar Notion:", error.message);
    // Devolver un error de servidor (500) al frontend
    res.status(500).json({
      error: "Fallo al obtener los datos de Notion.",
      details: error.message,
    });
  }
});

// 6. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server API corriendo en http://localhost:${PORT}`);
  console.log(`Endpoint de prueba: http://localhost:${PORT}/api/notion/items`);
});
