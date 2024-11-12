const { sequelize } = require("./models/index");
const config = require("./config/index");
const express = require("express");
const app = express();
const cors = require("cors");
const {
  connectMQTT,
  subscribeToTopic,
  disconnectMQTT,
  publishMessage,
} = require("./utils/mqtt");
const { redisClient } = require("./utils/redis");
const { syncUsersInRedis } = require("./src/user/user.service");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger");
const { initializeRoutes } = require("./config/router");

app.use(express.json());
app.use(cors());
const router = express.Router();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
initializeRoutes(app, router);
app.use("/", router);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.get("/health", async (req, res) => {
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Check service health
   *     responses:
   *       200:
   *         description: Redis and MySQL connections are healthy
   *       500:
   *         description: Health check failed
   */
  await redisClient.healthCheck();
  await sequelize.authenticate();
  res.send("Reddis and MYSql connections are healthy");
});

app.post("/mqtt", async (req, res) => {
  /**
   * @swagger
   * /mqtt:
   *   post:
   *     summary: post a message on mqtt
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - channel
   *               - message
   *               - email
   *             properties:
   *               channel:
   *                 type: string
   *                 example: test/channel
   *               message:
   *                 type: string
   *                 example: This is a test message
   *     responses:
   *       200:
   *         description: Message Published
   *       500:
   *         description: Internal Server Error while publishing message
   */
  try {
    const { channel, message } = req.body;
    publishMessage(channel, JSON.stringify(message));
    res.send("Message Published");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error while publishing message");
  }
});

connectMQTT().then(subscribeToTopic("#"));

redisClient.connect();

process.on("SIGINT", () => {
  disconnectMQTT();
  redisClient.disconnect();
  process.exit();
});

syncUsersInRedis().then(() => {
  app.listen(config.appPort, () => {
    console.log(`Server running on port ${config.appPort}`);
  });
});
