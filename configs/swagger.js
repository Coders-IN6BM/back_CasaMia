import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Casa Mia Management API",
      version: "1.0.0",
      description: "API para la gestión de hoteles, habitaciones y reservaciones",
    },
    servers: [
      {
        url: "http://localhost:3001", // Cambia esto si usas otro puerto
      },
    ],
  },
  apis: ["./routes/*.js"], // Ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs disponibles en http://localhost:3001/api-docs");
};