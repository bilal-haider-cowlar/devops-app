const userController = require("./user.controller");
const authMiddleware = require("../auth/auth.middleware");

exports.routesConfig = (app, router) => {
  const group = `/users`;
  router.get(group + "/", [authMiddleware.verifyJWT, userController.getUsers]);
};
