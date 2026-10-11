import { url } from 'inspector/promises';
import { CreateUrlDto } from '../dtos/url.dto';
import { Url, IUrl } from '../models//Url';
import { id } from 'zod/v4/locales';

export interface CreateUrl {
  originalUrl: string;
  shortUrl: string;
}
export interface UrlStats {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UrlRepository {
  async createUrl(createUrlDto: CreateUrlDto): Promise<IUrl> {
    const url = new Url(createUrlDto);
    return await url.save();
  }

  async findUrlbyShortUrl(shortUrl: string): Promise<IUrl | null> {
    return await Url.findOne({ shortUrl });
  }

  async findAll() {
    const urls = await Url.find()
      .select({
        _id: 1,
        originalUrl: 1,
        shortUrl: 1,
        clicks: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 });

    return urls.map((url) => ({
      id: url._id?.toString() || '',
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));
  }

  async updateClicks(shortUrl: string) {
    
    const url = await Url.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } },
      { new: true },
    );

    return;
  }

  async findStatsbyShortUrl(shortUrl: string) : Promise<UrlStats | null> {
        const url = await Url.findOne({ shortUrl });
        if (!url) return null;

        return {
          id: url._id?.toString() || '',
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          clicks: url.clicks,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt,
        };
  }
}
