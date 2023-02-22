const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRouter = require("express").Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const protect = require("./auth").protect;
const Email = require("./../utils/email");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.get("/testauth", protect, async (request, response) => {
  response.json({
    message: "You are authorized to access testauth",
  });
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json({
    status: "Success",
    numberOfUsers: users.length,
    data: {
      users,
    },
  });
});

usersRouter.post(
  "/",
  body("email")
    .isString()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email entered is not a valid email"),
  body("password")
    .isString()
    .isStrongPassword({
      minLength: 8,
      maxLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10, //in case we want to let the user know how good their password is
    })
    .withMessage(
      "Passwords must be between 8-10 characters long, have at least one uppercase letter, lowercase letter, number and symbol"
    ),
  body("username")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("firstName")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for first name"),
  body("lastName")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("phoneNumber")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isMobilePhone()
    .withMessage("Invalid input for phone number"),

  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        status: "Fail",
        error: errors.array(),
      });
    }

    const userInfo = request.body;
    const emailExists = await User.findOne({ email: userInfo.email });
    const phoneNumberExists = await User.findOne({
      phoneNumber: userInfo.phonenumber,
    });
    const usernameExists = await User.findOne({ username: userInfo.username });
    if (emailExists !== null) {
      return response.status(400).json({
        status: "Fail",
        error: "There already exists a user with the given email",
      });
    }

    if (phoneNumberExists !== null) {
      return response.status(400).json({
        status: "Fail",
        error: "There already exists a user with the given phone number",
      });
    }

    if (usernameExists !== null) {
      return response.status(400).json({
        status: "Fail",
        error: "There already exists a user with the given username",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userInfo.password, saltRounds);

    const user = new User({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      passwordHash: passwordHash,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
    });

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // token expires in 20 min
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: "20m",
    });

    response.cookie("jwt", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //set expiration date of cookie to 30 days from now
      secure: false, //only used with HTTPS
      httpOnly: true, //cookie cannot be accessed or modified by browser, prevents cross side scripting attacks
    });

    const savedUser = await user.save();

    const url = "http://localhost:3000/";
    await new Email(user, url).sendWelcomeToApp();

    response.status(201).json({
      status: "Success",
      token,
      data: {
        savedUser,
      },
    });
  }
);

module.exports = usersRouter;
