import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import stocksRouter from './routes/stocks';
import aiRouter from './routes/ai';
import authRouter from './routes/auth';
import { requireAuth } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 5000;

// Behind nginx, trust the first proxy so req.ip is the real client IP.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/stocks', stocksRouter);
app.use('/api/auth', authRouter);
// AI calls use your Gemini quota, so only signed-in users may make them.
app.use('/api/ai', requireAuth, aiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});