import { Router } from 'express';
import { fetchQuote, fetchHistory } from '../services/finnhubService';

const router = Router();

router.get('/:symbol', async (req, res) => {
  try {
    const stock = await fetchQuote(req.params.symbol);
    res.json(stock);
  } catch (err) {
    console.error('Quote fetch error:', err); // ADD THIS LINE
    res.status(404).json({ error: 'Could not fetch stock quote' });
  }
});

router.get('/:symbol/history', async (req, res) => {
  try {
    const history = await fetchHistory(req.params.symbol);
    res.json(history);
  } catch (err) {
    res.status(404).json({ error: 'Could not fetch stock history' });
  }
});

export default router;
