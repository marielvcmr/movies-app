import express from 'express';
import { corsMiddleware } from './config/cors.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/v1/health', healthRoutes);

export default app;
