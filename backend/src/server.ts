/**
 * @module server
 */

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import app from './app';
import config from './utils/config';
import logger from './utils/logger';
import { connectToDatabases } from './db/connection';

// Start server after DB connection
connectToDatabases()
  .then(() => {
    app.listen(config.PORT, () => {
      logger.info(`🚀 App is running on port ${config.PORT}`);
    });
  })
  .catch((err: unknown) => {
    logger.error('Database connection failed:', err);
  });
