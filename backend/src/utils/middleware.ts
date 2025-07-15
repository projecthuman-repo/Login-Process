import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export const requestLogger = (request: Request, response: Response, next: NextFunction): void => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

export const unknownEndpoint = (request: Request, response: Response): void => {
  response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (error: any, request: Request, response: Response, next: NextFunction): void => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).json({ error: 'token invalid or missing' });
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).json({ error: 'token expired' });
  } else {
    next(error);
  }
};
