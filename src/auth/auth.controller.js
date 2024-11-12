const Validator = require("validatorjs");
const userServices = require("../user/user.service");
const {
  hashPassword,
  createJWT,
  comparePassword,
} = require("../../utils/helpers");
const { publishMessage } = require("../../utils/mqtt");

exports.signUp = async (req, res) => {
  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Sign up a new user
   *     description: Creates a new user with the provided username, password, and email.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *               - email
   *             properties:
   *               username:
   *                 type: string
   *                 example: johndoe
   *               password:
   *                 type: string
   *                 example: securePassword123
   *               email:
   *                 type: string
   *                 format: email
   *                 example: johndoe@example.com
   *           examples:
   *             validData:
   *               summary: A valid example of a request body
   *               value:
   *                 username: johndoe
   *                 password: securePassword123
   *                 email: johndoe@example.com
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User registered successfully
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation failed
   *                 errors:
   *                   type: object
   *                   properties:
   *                     username:
   *                       type: string
   *                       example: The username field is required.
   *                     password:
   *                       type: string
   *                       example: The password field is required.
   *                     email:
   *                       type: string
   *                       example: The email field must be a valid email.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */
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
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     description: Authenticates a user with email and password, returns a JWT token if credentials are valid.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: johndoe@example.com
   *               password:
   *                 type: string
   *                 example: securePassword123
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Login successful
   *                 token:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         description: Invalid credentials or missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid password
   *                 errors:
   *                   type: object
   *                   properties:
   *                     email:
   *                       type: string
   *                       example: "The email field is required."
   *                     password:
   *                       type: string
   *                       example: "The password field is required."
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */
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
