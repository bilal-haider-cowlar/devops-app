const userServices = require("./user.service");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsersFromRedis();
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
