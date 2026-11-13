import express from 'express';
import { corsMiddleware } from './config/cors.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/v1/health', healthRoutes);

// These two must stay last, after every route.
app.use(notFound);
app.use(errorHandler);

export default app;
