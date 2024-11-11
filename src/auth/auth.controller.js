const Validator = require("validatorjs");
const userServices = require("../user/user.service");
const {
  hashPassword,
  createJWT,
  comparePassword,
} = require("../../utils/helpers");
const { publishMessage } = require("../../utils/mqtt");

exports.signUp = async (req, res) => {
  try {
    const validation = new Validator(req.body, {
      username: "required",
      password: "required",
      email: "required|email",
    });

    if (validation.fails()) {
      return res.status(400).json({ errors: validation.errors });
    }
    const { username, email, password } = req.body;

    const existingUser = await userServices.findUserByWhere({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userServices.create({
      username,
      email,
      password: hashedPassword,
    });

    await userServices.addUserInRedis(newUser.id, {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    const token = createJWT({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    publishMessage(
      `/user/${newUser.id}`,
      JSON.stringify({
        message: `New User ${newUser.username} Sigged Up`,
        email: newUser.email,
      }),
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const validation = new Validator(req.body, {
      email: "required|email",
      password: "required",
    });

    if (validation.fails()) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { email, password } = req.body;

    const user = await userServices.findUserByWhere({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = createJWT({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    publishMessage(
      `/user/${user.id}`,
      JSON.stringify({
        message: `User ${user.username} logged in`,
        email: user.email,
      }),
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
