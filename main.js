require("./models/index");
const models = require("./models");
const UsersModel = models.Users;

const getUsers = async () => {
  console.log((await UsersModel.findOne()).toJSON());
};
getUsers();
console.log("hello world");
