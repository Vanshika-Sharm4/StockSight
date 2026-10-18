import { GoogleGenAI, Type } from '@google/genai';
import type { AIAnalysis, HoldingContext } from '../types/ai';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// Override with GEMINI_MODEL in backend/.env if Google retires or limits this model.
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

const SYSTEM_PROMPT = `You are StockSight AI, a financial analysis assistant embedded in a stock
portfolio dashboard. You are given a user's question and, optionally, their
current holdings as context.

Ground every claim in the provided context. If you lack real-time data for a
claim, phrase it as a general/historical observation rather than inventing a
specific current figure.`;

// Gemini enforces this schema directly on the model's output, so unlike a
// prompt-only approach there's no need to parse/clean the response text.
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sentiment: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
    keyIndicators: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-5 short bullet-style indicators, each under 12 words',
    },
    verdict: { type: Type.STRING, enum: ['Buy', 'Hold', 'Sell'] },
    rationale: { type: Type.STRING, description: '2-3 sentences explaining the verdict' },
    summary: { type: Type.STRING, description: "1-2 sentence direct answer to the user's question" },
  },
  required: ['sentiment', 'keyIndicators', 'verdict', 'rationale', 'summary'],
};

function buildContext(holdings?: HoldingContext[]): string {
  if (!holdings || holdings.length === 0) return '';
  const lines = holdings
    .map((h) => `- ${h.symbol} (${h.companyName}): ${h.units} units, ${h.changePercent >= 0 ? '+' : ''}${h.changePercent.toFixed(2)}% today, value $${h.value.toFixed(2)}`)
    .join('\n');
  return `\n\nUser's current holdings:\n${lines}`;
}

export async function runAIQuery(prompt: string, holdings?: HoldingContext[]): Promise<AIAnalysis> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${prompt}${buildContext(holdings)}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No text response from model');
  }

  return JSON.parse(text) as AIAnalysis;
}

export async function runPortfolioInsights(holdings: HoldingContext[]): Promise<AIAnalysis> {
  return runAIQuery(
    'Give an overall sentiment, risk assessment, and buy/hold/sell verdict for this portfolio as a whole.',
    holdings,
  );
}
