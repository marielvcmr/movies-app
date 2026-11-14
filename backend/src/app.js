import express from 'express';
import { corsMiddleware } from './config/cors.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes/index.js';

const API_PREFIX = '/api/v1';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use(API_PREFIX, apiRoutes);

// These two must stay last, after every route.
app.use(notFound);
app.use(errorHandler);

export default app;
