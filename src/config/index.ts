import dotenv from 'dotenv';

type serverConfig = {
  PORT: number;
  MONGO_URI: number;
  MONGO_URL: number;
  REDIS_URL?: string;
  REDIS_COUNTER_KEY: string;
};

function loadenv() {
  console.log('Environment variables loaded successfully');
}

loadenv();

export const serverConfig: serverConfig = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3004,
  MONGO_URI: process.env.MONGO_URI ? parseInt(process.env.MONGO_URI, 10) : 27017,
  MONGO_URL: process.env.MONGO_URL ? parseInt(process.env.MONGO_URL, 10) : 27017,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_COUNTER_KEY: process.env.REDIS_COUNTER_KEY || 'url_shornter_counter',
};
