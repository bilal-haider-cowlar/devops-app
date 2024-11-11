const models = require("../../models");
const { redis } = require("../../utils/redis");
const userModel = models.Users;

exports.findUserByWhere = async (where) => {
  try {
    const user = await userModel.findOne({ where: where });
    return user;
  } catch (error) {
    throw new Error("Error while finding user");
  }
};

exports.create = async (data) => {
  try {
    const user = await userModel.create(data);
    return user;
  } catch (error) {
    throw new Error("Error while creating user");
  }
};

exports.findUsersByWhere = async ({ where = {}, attributes = [] }) => {
  try {
    const users = await userModel.findAll({ where, attributes });
    return users;
  } catch (error) {
    throw new Error("Error while finding users");
  }
};

exports.addUserInRedis = async (userId, data) => {
  try {
    const userKey = `user:${userId}`;
    redis.set(userKey, JSON.stringify(data));
  } catch (error) {
    throw new Error("Error while creating user in redis");
  }
};

exports.getAllUsersFromRedis = async () => {
  const users = [];
  try {
    for await (const key of redis.scanIterator({ MATCH: "user:*" })) {
      const userData = await redis.get(key);
      users.push(JSON.parse(userData));
    }
    return users;
  } catch (error) {
    console.error("Error fetching users from Redis:", error);
    throw error;
  }
};

exports.syncUsersInRedis = async () => {
  try {
    const users = await this.findUsersByWhere({
      attributes: ["id", "username", "email"],
    });
    for (const user of users) {
      const redisKey = `user:${user.id}`;

      const exists = await redis.exists(redisKey);

      if (!exists) {
        // Add user to Redis if not already present
        await redis.set(redisKey, JSON.stringify(user));
        console.log(`User ${user.id} added to Redis`);
      }
    }
  } catch (error) {
    throw new Error("Error while creating user in redis");
  }
};
