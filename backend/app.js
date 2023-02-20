const config = require("./utils/config");
const express = require("express");
require("express-async-errors"); // eliminates need for try-catch blocks
const morgan = require("morgan");

const app = express();

//MIDDLEWARE
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors"); // required for frontend
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const googleUsersRouter = require("./controllers/googleUsers");
const authRouter = require("./controllers/auth").authRouter;
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.DATABASE_CONNECTION);

mongoose
  .connect(config.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Db connection was successful");
  })
  .catch((err) => {
    logger.info("error connecting to MongoDB:", err.message);
  });
app.use(helmet());
app.use(cors());

// app.use(express.static('build'))  - possibly needed for frontend production build
app.use(express.json({ limit: "10kb" }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

app.use(middleware.requestLogger);
app.use(morgan("dev"));

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/googleusers", googleUsersRouter);
app.use("/api/authentication", authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
