require("dotenv").config();
module.exports = {
  xApiKey: process.env.X_API_KEY || "",
  appUrl: process.env.APP_URL,
  environment: process.env.NODE_ENV || "development",
  appPort: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
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
  },
};
