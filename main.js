require("./models/index");
const config = require("./config/index");
const express = require("express");
const app = express();
const authRouter = require("./src/auth/auth.route");
const userRouter = require("./src/user/user.route");
const {
  connectMQTT,
  subscribeToTopic,
  disconnectMQTT,
} = require("./utils/mqtt");

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("App is running");
});

connectMQTT().then(subscribeToTopic("#"));

process.on("SIGINT", () => {
  disconnectMQTT();
  process.exit();
});
app.listen(config.appPort, () => {
  console.log(`Server running on port ${config.appPort}`);
});
