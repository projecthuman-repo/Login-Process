const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
    const errors = validationResult(request).array();
    let list_errors = "";
    for (let i = 0; i < errors.length; i++) {
      list_errors += errors[i].msg + "\n";
    }
    if (list_errors) {
      return response.status(400).json({
        status: "Fail",
        error: list_errors,
      });
    }

    const userInfo = request.body;
    const emailExists = await User.findOne({ email: userInfo.email });
    const phoneNumberExists = await User.findOne({
      phoneNumber: userInfo.phoneNumber,
    });
    const usernameExists = await User.findOne({ username: userInfo.username });
    let exists_errors = "";
    if (emailExists !== null) {
      /* return response.status(400).json({
        status: "Fail",
        error: "There already exists a user with the given email",
      }); */
      exists_errors += "There already exists a user with the given email\n";
    }

    if (phoneNumberExists !== null) {
      /*  return response.status(400).json({
        status: "Fail",
        error: "There already exists a user with the given phone number",
      }); */
      exists_errors +=
        "There already exists a user with the given phone number\n";
    }

    if (usernameExists !== null) {
      /*  return response.status(400).json({
        status: "Fail",
        error: "There already exists a user with the given username",
      }); */
      exists_errors += "There already exists a user with the given username\n";
    }
    if (exists_errors) {
      return response.status(400).json({
        status: "Fail",
        error: exists_errors,
      });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userInfo.password, saltRounds);
    const emailToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      passwordHash: passwordHash,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      emailToken: emailToken,
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

    const url = `http://localhost:3000/verification/?token=${emailToken}`;
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

usersRouter.patch("/verification/", async (request, response) => {
  const token = request.query.token;
  const user = await User.findOne({ emailToken: token });
  if (!user) {
    return response.status(401).json({
      status: "Fail",
      error:
        "No user account associated with token, please go and register an account!",
    });
  }
  user.isVerified = true;
  await user.save();
  return response.json({
    status: "Success",
    token,
    message: "Please check your email to verify your account!",
  });
});

module.exports = usersRouter;
