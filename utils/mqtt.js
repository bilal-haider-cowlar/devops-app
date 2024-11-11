const mqtt = require("mqtt");
const config = require("../config/index");

let client;

const connectMQTT = async () => {
  const brokerUrl = `${config.mqtt.ssl ? "wss" : "ws"}://${config.mqtt.host}:${Number(
    config.mqtt.port,
  )}/mqtt`;
  client = mqtt.connect(brokerUrl);

  // Wait for the connection to be established
  return new Promise((resolve, reject) => {
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      resolve(); // Resolve when connected
    });

    client.on("error", (err) => {
      console.error("Error connecting to MQTT broker:", err);
      reject(err); // Reject if there's an error
    });

    client.on("disconnect", () => {
      console.log("Disconnected from MQTT broker");
    });

    client.on("close", () => {
      console.log("MQTT connection closed");
    });

    client.on("message", (topic, message) => {
      console.log(`Message received on topic ${topic}: ${message.toString()}`);
    });
  });
};

const subscribeToTopic = (topic) => {
  if (!client) {
    console.error("MQTT client is not connected.");
    return;
  }

  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
};

const publishMessage = (topic, message) => {
  if (!client) {
    console.error("MQTT client is not connected.");
    return;
  }

  client.publish(topic, message, (err) => {
    if (err) {
      console.error("Publish error:", err);
    }
  });
};

const disconnectMQTT = () => {
  if (client) {
    client.end(() => {
      console.log("MQTT client disconnected successfully.");
    });
  } else {
    console.log("No MQTT client to disconnect.");
  }
};

module.exports = {
  connectMQTT,
  subscribeToTopic,
  publishMessage,
  disconnectMQTT,
};
