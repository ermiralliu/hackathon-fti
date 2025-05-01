// @ts-ignore
if (process.env['NODE_ENV'] !== 'production') {
  // Load environment variables from .env file in development
  // dynamic import
  const dotenv = await import('dotenv')
  dotenv.config();
  console.log('Running in development mode, loaded .env variables.');
} else {
  console.log('Running in production mode, using system environment variables.');
}

import { PrismaClient } from '$prisma-client';

const prisma = new PrismaClient();

export default prisma;