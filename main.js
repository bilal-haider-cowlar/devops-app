const { sequelize } = require("./models/index");
const config = require("./config/index");
const express = require("express");
const app = express();
const authRouter = require("./src/auth/auth.route");
const userRouter = require("./src/user/user.route");
const {
  connectMQTT,
  subscribeToTopic,
  disconnectMQTT,
  publishMessage,
} = require("./utils/mqtt");
const { redisClient } = require("./utils/redis");
const { syncUsersInRedis } = require("./src/user/user.service");

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.get("/health", async (req, res) => {
  await redisClient.healthCheck();
  await sequelize.authenticate();
  res.send("Reddis and MYSql connections are healthy");
});

app.post("/mqtt", async (req, res) => {
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
