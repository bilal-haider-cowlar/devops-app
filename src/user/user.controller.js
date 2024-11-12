const userServices = require("./user.service");

exports.getAllUsers = async (req, res) => {
  /**
   * @swagger
   * /user/get-all:
   *   get:
   *     security:
   *      - bearerAuth: []
   *     summary: Get All users data
   *     responses:
   *       200:
   *         description: Get Users Data
   *       500:
   *         description: Internal Server Error
   */
  try {
    const users = await userServices.getAllUsersFromRedis();
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
