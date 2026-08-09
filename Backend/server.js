import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;
const model = process.env.OPENROUTER_MODEL || 'openrouter/free';
const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
const allowedOrigins = new Set([
  'https://ai-relocation-operations-hub.vercel.app',
  'http://localhost:3000'
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS.'));
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '256kb' }));

function requireRelocation(req, res) {
  const relocation = req.body?.relocation;
  if (!relocation || typeof relocation !== 'object') {
    res.status(400).json({ error: 'A relocation case is required.' });
    return null;
  }
  return relocation;
}

function getResponseContent(data) {
  const content = data?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    return content.map(part => part.text || '').join('').trim();
  }
  return typeof content === 'string' ? content.trim() : '';
}

async function askOpenRouter(messages, responseFormat) {
  if (!process.env.OPENROUTER_API_KEY) {
    const error = new Error('OPENROUTER_API_KEY is not configured.');
    error.status = 503;
    throw error;
  }

  const response = await fetch(openRouterUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'AI Relocation Operations Hub'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 450,
      ...(responseFormat ? { response_format: responseFormat } : {})
    })
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`OpenRouter request failed (${response.status}): ${details.slice(0, 300)}`);
    error.status = 502;
    throw error;
  }

  const content = getResponseContent(await response.json());
  if (!content) {
    const error = new Error('OpenRouter returned an empty response.');
    error.status = 502;
    throw error;
  }
  return content;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model });
});

app.post('/api/ai/summary', async (req, res) => {
  const relocation = requireRelocation(req, res);
  if (!relocation) return;

  try {
    const content = await askOpenRouter([
      {
        role: 'system',
        content: 'You are a relocation operations manager. Write concise, factual operational summaries. Mention stage, route and move date, task progress, urgent blockers, and the most important follow-up. Do not invent facts. Use plain text with short labeled lines.'
      },
      {
        role: 'user',
        content: `Create a concise status summary for this relocation case:\n${JSON.stringify(relocation)}`
      }
    ]);
    res.json({ content, source: 'openrouter' });
  } catch (error) {
    console.error('Summary generation failed:', error.message);
    res.status(error.status || 502).json({ error: 'AI summary generation failed.' });
  }
});

app.post('/api/ai/next-action', async (req, res) => {
  const relocation = requireRelocation(req, res);
  if (!relocation) return;

  try {
    const content = await askOpenRouter([
      {
        role: 'system',
        content: 'You are a relocation operations manager. Recommend exactly one practical next action using only the provided case data. Consider current stage, pending task priority, due dates, move date proximity, customer priority, and recent activities. Return valid JSON only with keys: title, assignee, dueDate, priority, rationale, actionableTaskId, advanceStage. Use null for inapplicable actionableTaskId or advanceStage. priority must be Critical, High, Medium, or Low.'
      },
      {
        role: 'user',
        content: `Recommend the single highest-leverage next action for this relocation case:\n${JSON.stringify(relocation)}`
      }
    ], { type: 'json_object' });

    let recommendation;
    try {
      recommendation = JSON.parse(content);
    } catch {
      const error = new Error('OpenRouter returned invalid recommendation JSON.');
      error.status = 502;
      throw error;
    }
    res.json({ recommendation, source: 'openrouter' });
  } catch (error) {
    console.error('Next-action generation failed:', error.message);
    res.status(error.status || 502).json({ error: 'AI next-action generation failed.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`AI backend listening on http://0.0.0.0:${port}`);
});
