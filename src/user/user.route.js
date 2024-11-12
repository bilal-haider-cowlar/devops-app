const userController = require("./user.controller");
const authMiddleware = require("../auth/auth.middleware");

exports.routesConfig = (app, router) => {
  const group = `/user`;
  router.get(group + "/get-all", [
    authMiddleware.verifyJWT,
    userController.getAllUsers,
  ]);
};
