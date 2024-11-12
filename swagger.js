const swaggerJSDoc = require("swagger-jsdoc");
const config = require("./config/index");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "API documentation for your project",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: config.appUrl,
      },
    ],
  },
  apis: ["./main.js", "./src/*/*.controller.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
