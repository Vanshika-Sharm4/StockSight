import { Router } from 'express';
import { runAIQuery, runPortfolioInsights } from '../services/aiService';
import type { AIInsightsRequest, AIQueryRequest } from '../types/ai';

const router = Router();

router.post('/query', async (req, res) => {
  const { prompt, holdings } = req.body as AIQueryRequest;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const analysis = await runAIQuery(prompt, holdings);
    res.json(analysis);
  } catch (err) {
    console.error('AI query error:', err);
    res.status(502).json({ error: 'AI query failed' });
  }
});

router.post('/insights', async (req, res) => {
  const { holdings } = req.body as AIInsightsRequest;

  if (!Array.isArray(holdings) || holdings.length === 0) {
    return res.status(400).json({ error: 'holdings are required' });
  }

  try {
    const analysis = await runPortfolioInsights(holdings);
    res.json(analysis);
  } catch (err) {
    console.error('AI insights error:', err);
    res.status(502).json({ error: 'AI insights failed' });
  }
});

export default router;
