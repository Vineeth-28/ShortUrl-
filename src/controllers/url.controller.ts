import { z } from 'zod';
import { UrlService } from '../service/url.service';
import { publicProcedure } from '../routes/trpc/context';
import { InternalServerError } from '../utils/errors/app.error';
import logger from '../config/logger.config';
import { UrlRepository } from '../repositories/url.repository';
import { CacheRepository } from '../repositories/cache.repository';
import { Request, Response } from 'express';

const urlService = new UrlService(new UrlRepository(), new CacheRepository());

export const urlController: { create: any; getOriginalUrl: any } = {
  create: publicProcedure
    .input(
      z.object({
        originalUrl: z.string().url({ message: 'Invalid URL' }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await urlService.createShortUrl(input.originalUrl);
        return result;
      } catch (error) {
        logger.error('Error creating short URL', error);
        throw new InternalServerError('Failed to create short URL');
      }
    }),

  getOriginalUrl: publicProcedure
    .input(
      z.object({
        shortUrl: z.string().min(1, 'Short URL is required'),
      }),
    )
    .query(async ({ input }) => {
      try {
        const result = await urlService.getOriginalUrl(input.shortUrl);
        return result;
      } catch (error) {
        logger.error('Error getting original URL', error);
        throw new InternalServerError('Failed to get original URL');
      }
    }),
};

export async function redirectUrl(req: Request<{ shortUrl: string }>, res: Response) {
  const { shortUrl } = req.params;

  const url = await urlService.getOriginalUrl(shortUrl);
  await urlService.updateClicks(shortUrl);

  res.redirect(url.originalUrl);
}
