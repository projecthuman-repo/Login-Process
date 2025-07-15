/**
 * @module app
 */

import dotenv from 'dotenv';
dotenv.config();

import oauthRoutes from './routes/oauthRoutes';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import config from './utils/config';
import * as middleware from './utils/middleware';


// Routers / Controllers
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';
import googleUsersRouter from './controllers/googleUsers';
import facebookUsersRouter from './controllers/facebookUsers';
import instagramUsersRouter from './controllers/instagramUsers';
// import mastodonUserRouter from './controllers/mastodonUsers'; // REMOVE THIS
import { authRouter as externalAuthRouter } from './controllers/auth';
import localAuthRouter from './routes/auth';

const app: Application = express();

// ─── GLOBAL MIDDLEWARE ──────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(compression());
app.use(middleware.requestLogger);
app.use(morgan('dev'));

// ─── ROUTES ─────────────────────────────────────────────────────────────────────
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/googleUsers', googleUsersRouter);
app.use('/api/instagramUsers', instagramUsersRouter);
app.use('/api/facebookUsers', facebookUsersRouter);
// app.use('/api/mastodonUsers', mastodonUserRouter); // REMOVE THIS
app.use('/api/authentication', externalAuthRouter);
app.use('/api/auth', localAuthRouter);
app.use(oauthRoutes);

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Login backend is running' });
});

// ─── ERROR HANDLING ─────────────────────────────────────────────────────────────
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
