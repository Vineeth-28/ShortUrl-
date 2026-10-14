import { serverConfig } from './config/index';
import express, { Application } from 'express';
import v1Router from './routes/v1/index.router';
import v2Router from './routes/v2';
import { genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationMiddleware } from './middlewares/correlation.middleware';
import { initRedis } from './config/redis';
import { connectDB } from './config/db';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { TrpcRouter } from './routes/trpc';

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(attachCorrelationMiddleware);
app.use('/trpc', createExpressMiddleware({
  router: TrpcRouter,
}));
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
  await initRedis();
  await connectDB();
});
