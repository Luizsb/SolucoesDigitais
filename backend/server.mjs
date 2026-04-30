import http from 'node:http';

const PORT = Number(process.env.API_PORT ?? 8787);
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
const OLLAMA_MODEL_OVERRIDE = process.env.OLLAMA_MODEL?.trim() || '';

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Payload muito grande.'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('JSON inválido.'));
      }
    });
    req.on('error', reject);
  });
}

function buildReviewPrompt(form) {
  return `Você é um especialista em qualidade de cadastros de soluções digitais.
Revise o cadastro e proponha melhorias objetivas, mantendo o significado original.
Responda SOMENTE em JSON válido com o formato:
{
  "suggestions": {
    "oQueE": "...",
    "quandoUsar": "...",
    "problemaResolvido": "...",
    "resultadoEsperado": "...",
    "impactoPrincipal": "...",
    "comoUsar": "...",
    "tags": "..."
  },
  "summary": "..."
}
Regras:
- Português do Brasil.
- Em "quandoUsar" e "tags", separe itens com ";".
- Não invente links.
- Se algum campo já estiver muito bom, pode manter próximo do original.

Cadastro:
${JSON.stringify(form, null, 2)}`;
}

function parseJsonFromText(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error('Modelo retornou conteúdo vazio.');
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim());
    }
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Não foi possível converter resposta do modelo em JSON.');
  }
}

function scoreModelName(name) {
  const lower = name.toLowerCase();
  let score = 0;
  if (lower.includes('r1') || lower.includes('reason')) score += 100;
  if (lower.includes('72b')) score += 90;
  if (lower.includes('70b')) score += 85;
  if (lower.includes('34b')) score += 70;
  if (lower.includes('32b')) score += 65;
  if (lower.includes('27b')) score += 60;
  if (lower.includes('14b')) score += 45;
  if (lower.includes('8b')) score += 30;
  if (lower.includes('qwen')) score += 20;
  if (lower.includes('llama3.3')) score += 20;
  if (lower.includes('llama3.1')) score += 15;
  if (lower.includes('mistral')) score += 10;
  return score;
}

async function resolveOllamaModels() {
  if (OLLAMA_MODEL_OVERRIDE) return [OLLAMA_MODEL_OVERRIDE];

  const tagsResponse = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
  if (!tagsResponse.ok) {
    throw new HttpError(503, `Ollama indisponível (tags ${tagsResponse.status}).`);
  }
  const tagsData = await tagsResponse.json();
  const models = (tagsData?.models ?? []).map((model) => model.name).filter(Boolean);
  if (models.length === 0) {
    throw new HttpError(503, 'Ollama sem modelos instalados. Faça pull de um modelo antes.');
  }

  return models.sort((a, b) => scoreModelName(b) - scoreModelName(a));
}

async function getOllamaReview(form) {
  const models = await resolveOllamaModels();
  const prompt = buildReviewPrompt(form);
  const failures = [];

  for (const model of models) {
    let response;
    try {
      response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          format: 'json',
          stream: false,
          options: {
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(120000),
      });
    } catch (error) {
      failures.push(
        `${model}: timeout/erro de conexão (${error instanceof Error ? error.message : 'erro desconhecido'})`,
      );
      continue;
    }

    if (!response.ok) {
      const details = (await response.text()).trim();
      failures.push(`${model}: HTTP ${response.status}${details ? ` - ${details}` : ''}`);
      continue;
    }

    try {
      const data = await response.json();
      const raw = String(data?.response ?? '').trim();
      const parsed = parseJsonFromText(raw);
      return {
        suggestions: parsed?.suggestions ?? {},
        summary: parsed?.summary ?? 'Revisão aplicada com Ollama.',
        source: 'ollama',
        model,
      };
    } catch (error) {
      failures.push(`${model}: resposta inválida (${error instanceof Error ? error.message : 'erro'})`);
    }
  }

  throw new HttpError(502, `Ollama falhou em todos os modelos testados. ${failures.join(' | ')}`);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    let status = 'unavailable';
    let model = OLLAMA_MODEL_OVERRIDE || null;
    try {
      const resolvedModel = (await resolveOllamaModels())[0];
      status = 'ollama';
      model = resolvedModel;
    } catch {
      status = 'unavailable';
    }

    sendJson(res, 200, {
      ok: true,
      service: 'ai-temp-backend',
      provider: status,
      ollamaConfigured: true,
      model,
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/ai/review-submission') {
    try {
      const body = await readJsonBody(req);
      const form = body.form ?? {};

      if (typeof form !== 'object' || form === null) {
        sendJson(res, 400, { error: 'Campo "form" é obrigatório.' });
        return;
      }
      try {
        const result = await getOllamaReview(form);
        sendJson(res, 200, result);
        return;
      } catch (error) {
        if (error instanceof HttpError) {
          sendJson(res, error.status, { error: error.message, source: 'ollama' });
          return;
        }
        throw error;
      }
    } catch (error) {
      sendJson(res, 500, { error: error instanceof Error ? error.message : 'Falha interna.' });
      return;
    }
  }

  sendJson(res, 404, { error: 'Rota não encontrada.' });
});

server.listen(PORT, () => {
  console.log(`[ai-temp-backend] online em http://localhost:${PORT}`);
  console.log(`[ai-temp-backend] provedor: Ollama (${OLLAMA_BASE_URL})`);
  console.log(
    `[ai-temp-backend] OLLAMA_MODEL: ${OLLAMA_MODEL_OVERRIDE || 'auto (modelo mais forte instalado)'}`,
  );
});
