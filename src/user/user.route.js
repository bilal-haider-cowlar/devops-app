const router = require("express").Router();
const userController = require("./user.controller");
const authMiddleware = require("../auth/auth.middleware");

router.get("/get-all", authMiddleware.verifyJWT, userController.getAllUsers);

module.exports = router;
