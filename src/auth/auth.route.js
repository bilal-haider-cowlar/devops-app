const authController = require("./auth.controller");

exports.routesConfig = (app, router) => {
  const group = `/auth`;
  router.post(group + "/signup", [authController.signUp]);
  router.post(group + "/login", [authController.login]);
};
