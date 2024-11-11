const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.createJWT = (data) => {
  return jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

exports.verifyJWTToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

exports.comparePassword = async (providedPassword, hashedPassword) => {
  return await bcrypt.compare(providedPassword, hashedPassword);
};
