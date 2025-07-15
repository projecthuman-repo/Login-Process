/**
 * @module config
 */

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const PORT: number = parseInt(process.env.PORT || '4000', 10);
const DATABASE_CONNECTION: string = process.env.DATABASE_CONNECTION || process.env.LOCAL_URI || '';
const DATABASE_CROSS_PLATFORM_CONNECTION: string = process.env.DATABASE_CROSS_PLATFORM_CONNECTION || process.env.LOCAL_URI || '';

const config = {
  PORT,
  DATABASE_CONNECTION,
  DATABASE_CROSS_PLATFORM_CONNECTION
};

export default config;
