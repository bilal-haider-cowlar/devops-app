const AuthRouter = require("../src/auth/auth.route");
const UserRouter = require("../src/user/user.route");

exports.initializeRoutes = (app, router) => {
  AuthRouter.routesConfig(app, router);
  UserRouter.routesConfig(app, router);
};
