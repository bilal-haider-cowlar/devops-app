const models = require("../../models");
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
