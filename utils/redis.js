const redis = require("redis");
const config = require("../config/index");

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      url: `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
    });

    this.client.on("error", (error) => {
      console.error(`Redis error: ${error}`);
      console.error(`Closing server due to redis error`);
      process.exit(1);
    });
  }

  async connect() {
    try {
      await this.client.connect();
      await this.client.ping();
      console.log("Connected to Redis successfully");
    } catch (error) {
      console.error("Error establishing Redis connection:", error.message);
      console.error(`Closing server due to redis error`);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await this.client.quit();
      console.log("Redis connection closed");
    } catch (error) {
      console.error("Error disconnecting from Redis:", error);
    }
  }
}

const redisClient = new RedisClient();
module.exports = { redisClient, redis: redisClient.client };
