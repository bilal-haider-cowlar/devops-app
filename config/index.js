require("dotenv").config();
const fs = require("fs");
const path = require("path");
module.exports = {
  appTitle: process.env.APP_TITLE || "devops-app",
  appUrl: process.env.APP_URL,
  environment: process.env.NODE_ENV || "development",
  appPort: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 637,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  mqtt: {
    host: process.env.MQTT_HOST || "localhost",
    port: process.env.MQTT_PORT || 8080,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    ssl: process.env.MQTT_SSL === "true",
    reconnect: process.env.MQTT_RECONNECT === "true",
    group: process.env.MQTT_GROUP,
    clientId: process.env.MQTT_CLIENT_ID || Date.now(),
    mqttTimeout: process.env.MQTT_RECONNECTION_TIMEOUT || 5 * 1000,
    mqttEnabled: process.env.MQTT_ENABLE || "true",
    mqttSubscribe: process.env.MQTT_SUBSCRIBE || "true",
  },
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: "mysql",
    logging: process.env.DB_CONSOLE_LOGGING == 1,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialectOptions:
      process.env.DB_USE_SSL_CERT_AUTH == "true"
        ? {
            ssl: {
              cert: fs.readFileSync(
                path.join(
                  __dirname,
                  "..",
                  "mount",
                  "DigiCertGlobalRootCA.crt.pem",
                ),
                "utf-8",
              ),
              rejectUnauthorized: true,
            },
          }
        : {},
  },
};
