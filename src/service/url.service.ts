import { UrlRepository } from '../repositories/url.repository';
import { CacheRepository } from '../repositories/cache.repository'; // Assuming this import exists
import { toBase62 } from '../utils/base62';
import { serverConfig } from '../config';
import { NotFoundError } from '../utils/errors/app.error';

export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly cacheRepository: CacheRepository,
  ) {}

  async createShortUrl(originalUrl: string) {
    const nextId = await this.cacheRepository.getNextId();
    const shortUrl = toBase62(nextId);

    const url = await this.urlRepository.createUrl({
      originalUrl,
      shortUrl,
    });

    await this.cacheRepository.setUrlMapping(shortUrl, originalUrl);
    const baseUrl = serverConfig.BASEURL;
    const fullUrl = `${baseUrl}/${shortUrl}`;

    return {
      id: url._id.toString(),
      shortUrl,
      originalUrl,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  async getOriginalUrl(shortUrl: string) {
    const originalUrl = await this.cacheRepository.getUrlMapping(shortUrl);

    if (originalUrl) {
      return {
        originalUrl,
        shortUrl,
      };
    }
    const url = await this.urlRepository.findUrlbyShortUrl(shortUrl);
    if (!url) {
      throw new NotFoundError('URL Not Found');
    }
    await this.cacheRepository.setUrlMapping(shortUrl, url.originalUrl);

    return {
      originalUrl: url.originalUrl,
      shortUrl,
    };
  }

  async updateClicks(shortUrl: string): Promise<void> {
    await this.urlRepository.updateClicks(shortUrl);
  }
}
