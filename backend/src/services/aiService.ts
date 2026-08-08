import Anthropic from '@anthropic-ai/sdk';
import type { AIAnalysis, HoldingContext } from '../types/ai';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

const MODEL = 'claude-sonnet-5';

const SYSTEM_PROMPT = `You are StockSight AI, a financial analysis assistant embedded in a stock
portfolio dashboard. You are given a user's question and, optionally, their
current holdings as context.

Respond with ONLY a single JSON object (no markdown fences, no preamble, no
trailing text) matching exactly this shape:

{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "keyIndicators": string[],   // 3-5 short bullet-style indicators, each under 12 words
  "verdict": "Buy" | "Hold" | "Sell",
  "rationale": string,         // 2-3 sentences explaining the verdict
  "summary": string            // 1-2 sentence direct answer to the user's question
}

Ground every claim in the provided context. If you lack real-time data for a
claim, phrase it as a general/historical observation rather than inventing a
specific current figure. Never wrap the JSON in backticks.`;

function buildContext(holdings?: HoldingContext[]): string {
  if (!holdings || holdings.length === 0) return '';
  const lines = holdings
    .map((h) => `- ${h.symbol} (${h.companyName}): ${h.units} units, ${h.changePercent >= 0 ? '+' : ''}${h.changePercent.toFixed(2)}% today, value $${h.value.toFixed(2)}`)
    .join('\n');
  return `\n\nUser's current holdings:\n${lines}`;
}

function parseAnalysis(raw: string): AIAnalysis {
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(cleaned);

  if (
    !parsed.sentiment ||
    !parsed.verdict ||
    !Array.isArray(parsed.keyIndicators) ||
    typeof parsed.rationale !== 'string' ||
    typeof parsed.summary !== 'string'
  ) {
    throw new Error('AI response did not match expected shape');
  }

  return parsed as AIAnalysis;
}

export async function runAIQuery(prompt: string, holdings?: HoldingContext[]): Promise<AIAnalysis> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${prompt}${buildContext(holdings)}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from model');
  }

  return parseAnalysis(textBlock.text);
}

export async function runPortfolioInsights(holdings: HoldingContext[]): Promise<AIAnalysis> {
  return runAIQuery(
    'Give an overall sentiment, risk assessment, and buy/hold/sell verdict for this portfolio as a whole.',
    holdings,
  );
}
