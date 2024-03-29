/**
 * Add better error messages via logger
 * @module middleware
 */

/**
 * @requires ./logger
 * @module logger
 */
const logger = require("./logger");
/**
 *
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {Function} next
 */
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

/**
 *
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {Function} next
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
/**
 *
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {Function} next
 */
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    // bad findById request
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid or missing" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
