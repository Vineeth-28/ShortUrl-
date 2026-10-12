import { serverConfig } from '../config';
import { redisClient } from '../config/redis';

export class CacheRepository {
  async getNextId(): Promise<number> {
    const key = serverConfig.REDIS_COUNTER_KEY;
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const result = await redisClient.incr(key);
    return result;
  }

  async setUrlMapping(shortUrl: string, originalUrl: string) {
    const key = `url${shortUrl}`;
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await redisClient.set(key, originalUrl, { EX: 864000 });
    return;
  }

  async getUrlMapping(shortUrl: string): Promise<string | null> {
    const key = `url${shortUrl}`;
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const result = await redisClient.get(key);
    return result;
  }
  async deleteUrlMapping(shortUrl: string): Promise<number> {
    const key = `url:${shortUrl}`; // Added a colon for standard Redis key spacing

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // redisClient.del() returns the number of keys deleted (0 or 1)
    const result = await redisClient.del(key);
    return result;
  }
}
