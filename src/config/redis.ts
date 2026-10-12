import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
  console.log('Redis error', err);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

export async function initRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection error', error);
    throw error;
  }
}

export async function closeRedis() {
  await redisClient.quit();
}
