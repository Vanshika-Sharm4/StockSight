import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import stocksRouter from './routes/stocks';
import aiRouter from './routes/ai';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/stocks', stocksRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});