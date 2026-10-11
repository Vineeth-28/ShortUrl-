import dotenv from 'dotenv';

type serverConfig = {
  PORT: number;
  MONGO_URI: number;
  MONGO_URL: number;
};

function loadenv() {
  console.log('Environment variables loaded successfully');
}

loadenv();

export const serverConfig: serverConfig = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3004,
  MONGO_URI: process.env.MONGO_URI ? parseInt(process.env.MONGO_URI, 10) : 27017,
  MONGO_URL: process.env.MONGO_URL ? parseInt(process.env.MONGO_URL, 10) : 27017,
};
