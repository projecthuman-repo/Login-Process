/**
 * @module app
 */

/**
 * @requires utils/config, express, express-async-errors, morgan
 * @const config
 * @const express
 * @const morgan
 * @const app
 */

const express = require("express");
require("express-async-errors"); // eliminates need for try-catch blocks
const morgan = require("morgan");
const app = express();

//MIDDLEWARE
/**
 * @const helmet sets several http headers for security
 * @const mongoSanitize helps sanitize mongodb queries against query selector injections
 * @const compression used to compress size of request
 * @const xss prevents xss attacks
 * @const usersRouter
 * @const loginRouter
 * @const googleUsersRouter
 * @const facebookUsersRouter
 * @const instagramUsersRouter
 * @const authRouter
 * @const middleware
 * @const logger
 * @const mongoose
 */
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const xss = require("xss-clean");
const cors = require("cors"); // required for frontend
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const googleUsersRouter = require("./controllers/googleUsers");
const facebookUsersRouter = require("./controllers/facebookUsers");
const instagramUsersRouter = require("./controllers/instagramUsers");
const authRouter = require("./controllers/auth").authRouter;
const middleware = require("./utils/middleware");

// Set up app middleware
app.use(helmet());
app.use(cors());

// app.use(express.static('build'))  - possibly needed for frontend production build
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Compress response data
app.use(compression());
app.use(middleware.requestLogger);
app.use(morgan("dev"));

// Routers

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/googleUsers", googleUsersRouter);
app.use("/api/instagramUsers", instagramUsersRouter);
app.use("/api/facebookUsers", facebookUsersRouter);
app.use("/api/authentication", authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
