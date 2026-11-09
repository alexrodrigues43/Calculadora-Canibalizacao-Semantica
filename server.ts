import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import net from 'net';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const bootStartTime = Date.now();

// Global diagnostic error catchers for container execution & startup observability
process.on('uncaughtException', (err: Error) => {
  console.error('[CRITICAL STARTUP/RUNTIME ERROR] Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('[CRITICAL STARTUP/RUNTIME ERROR] Unhandled rejection at:', promise, 'reason:', reason);
});

// Explicitly bind to PORT provided by the environment (Cloud Run injects PORT, default 3000)
const rawPort = process.env.PORT || '3000';
const PORT: number = parseInt(String(rawPort), 10) || 3000;

console.log('[INIT] ==========================================');
console.log('[INIT] Starting Calculadora de Canibalização...');
console.log(`[INIT] Node.js Runtime: ${process.version}`);
console.log(`[INIT] Process ID: ${process.pid}`);
console.log(`[INIT] Environment: NODE_ENV=${process.env.NODE_ENV || 'development'}`);
console.log(`[INIT] Assigned PORT: ${PORT} (from env: ${process.env.PORT ?? 'unset, defaulting to 3000'})`);
console.log(`[INIT] Working Directory: ${process.cwd()}`);
console.log('[INIT] ==========================================');

const app = express();

app.use(express.json({ limit: '10mb' }));

// Lazy-initialize Gemini AI client with required User-Agent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Mathematical Cosine Similarity calculation
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  // Clamp between -1 and 1
  return Math.max(-1, Math.min(1, similarity));
}

// Fallback TF-IDF cosine similarity if embedding API is unreachable
function fallbackTfidfSimilarity(text1: string, text2: string): number {
  const tokenize = (t: string) =>
    t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const wordsA = tokenize(text1);
  const wordsB = tokenize(text2);
  const vocab = Array.from(new Set([...wordsA, ...wordsB]));

  const countWords = (words: string[]) => {
    const map = new Map<string, number>();
    for (const w of words) map.set(w, (map.get(w) || 0) + 1);
    return map;
  };

  const mapA = countWords(wordsA);
  const mapB = countWords(wordsB);

  const vecA: number[] = [];
  const vecB: number[] = [];

  for (const term of vocab) {
    const countA = mapA.get(term) || 0;
    const countB = mapB.get(term) || 0;
    const idf = Math.log(1 + 2 / ((countA > 0 ? 1 : 0) + (countB > 0 ? 1 : 0)));
    vecA.push(countA * idf);
    vecB.push(countB * idf);
  }

  return calculateCosineSimilarity(vecA, vecB);
}

// SSRF Defense: Check if an IP address is within private, loopback, or cloud metadata ranges
function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  // Normalize IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return true;
    }
    const [a, b] = parts;
    // 0.0.0.0/8 (Broadcast/Current network)
    if (a === 0) return true;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (Private RFC 1918)
    if (a === 10) return true;
    // 172.16.0.0/12 (Private RFC 1918)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private RFC 1918)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (Link-local & Cloud Metadata endpoint 169.254.169.254)
    if (a === 169 && b === 254) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (a === 192 && b === 0) return true;
    // 198.18.0.0/15 (Benchmark testing)
    if (a === 198 && (b === 18 || b === 19)) return true;
    // 198.51.100.0/24 & 203.0.113.0/24 (Documentation)
    if ((a === 198 && b === 51) || (a === 203 && b === 0)) return true;
    // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
    if (a >= 224) return true;
    return false;
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    // Loopback
    if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1') return true;
    // Unspecified
    if (normalized === '::' || normalized === '0:0:0:0:0:0:0:0') return true;
    // Link-local: fe80::/10
    if (normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) return true;
    // Unique Local: fc00::/7 (fc00... ou fd00...)
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
    // IPv4-mapped IPv6
    if (normalized.startsWith('::ffff:')) {
      return isPrivateIp(normalized.substring(7));
    }
    return false;
  }

  return true;
}

// Validates a URL against Server-Side Request Forgery (SSRF) threats
async function validateUrlForSsrf(rawUrl: string): Promise<{ valid: boolean; error?: string; url?: URL }> {
  try {
    const parsed = new URL(rawUrl);

    // 1. Only allow HTTP and HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Protocolo não permitido. Apenas HTTP e HTTPS são suportados.' };
    }

    // 2. Reject credentials in URL
    if (parsed.username || parsed.password) {
      return { valid: false, error: 'Credenciais na URL não são permitidas.' };
    }

    // 3. Port restrictions (standard HTTP/HTTPS only)
    const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === 'https:' ? 443 : 80;
    if (port !== 80 && port !== 443) {
      return { valid: false, error: 'Porta não permitida. Apenas portas padrão 80 e 443 são aceitas.' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 4. Reject local and internal hostnames
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.includes('metadata.google') ||
      !hostname.includes('.')
    ) {
      return { valid: false, error: 'Acesso a domínios internos, locais ou de metadados é bloqueado por segurança.' };
    }

    // 5. If hostname is raw IP, validate directly
    if (net.isIP(hostname)) {
      if (isPrivateIp(hostname)) {
        return { valid: false, error: 'Acesso a endereços IP privados ou reservados é bloqueado por segurança.' };
      }
    }

    // 6. DNS lookup validation (prevent DNS rebinding / internal routing)
    const resolved = await dns.promises.lookup(hostname, { all: true });
    if (!resolved || resolved.length === 0) {
      return { valid: false, error: 'Não foi possível resolver o endereço DNS do domínio informado.' };
    }

    for (const record of resolved) {
      if (isPrivateIp(record.address)) {
        return {
          valid: false,
          error: 'O domínio resolve para endereço de rede privada ou reservada não autorizada.',
        };
      }
    }

    return { valid: true, url: parsed };
  } catch (err: any) {
    return { valid: false, error: `URL inválida: ${err.message}` };
  }
}

// Extract headings from unstructured or markdown text
function extractHeadingsFromText(text: string): { h1: string[]; h2: string[] } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const h1: string[] = [];
  const h2: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      const heading = line.replace(/^#\s+/, '').trim();
      if (heading && !h1.includes(heading)) h1.push(heading);
    } else if (line.startsWith('## ')) {
      const heading = line.replace(/^##\s+/, '').trim();
      if (heading && !h2.includes(heading)) h2.push(heading);
    } else if (line.toLowerCase().startsWith('título:') || line.toLowerCase().startsWith('titulo:')) {
      const heading = line.replace(/^t[ií]tulo:\s*/i, '').trim();
      if (heading && !h1.includes(heading)) h1.push(heading);
    } else if (line.match(/^(\d+[\.\)]|[A-Z][\.\)])\s+[A-ZÀ-Ú]/) && line.length < 80) {
      if (!h2.includes(line)) h2.push(line);
    }
  }

  // If no explicit markdown/section headings were found, extract heading-like candidate lines
  if (h2.length === 0) {
    for (const line of lines) {
      if (line.length > 5 && line.length < 80 && !line.endsWith('.') && !line.endsWith(',') && !line.endsWith(';')) {
        if (!h1.includes(line) && !h2.includes(line) && h2.length < 10) {
          h2.push(line);
        }
      }
    }
  }

  return { h1: h1.slice(0, 3), h2: h2.slice(0, 15) };
}

// URL fetching & content extraction helper with SSRF defense and secure redirect tracking
async function scrapeUrl(initialUrl: string, maxRedirects = 4) {
  let currentUrl = initialUrl;
  let redirectsRemaining = maxRedirects;

  while (redirectsRemaining >= 0) {
    const ssrfCheck = await validateUrlForSsrf(currentUrl);
    if (!ssrfCheck.valid) {
      return {
        success: false,
        url: currentUrl,
        error: ssrfCheck.error || 'URL bloqueada por políticas de segurança.',
        title: '',
        metaDescription: '',
        h1: [],
        h2: [],
        wordCount: 0,
        text: '',
        textSnippet: '',
      };
    }

    try {
      const response = await fetch(currentUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (SEO-Semantic-Cannibalization-Bot)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        redirect: 'manual',
        signal: AbortSignal.timeout(12000),
      });

      // Handle HTTP redirects securely by validating target URL with anti-SSRF checks
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`Redirecionamento ${response.status} sem cabeçalho Location.`);
        }
        redirectsRemaining--;
        if (redirectsRemaining < 0) {
          throw new Error('Excesso de redirecionamentos na URL informada.');
        }
        const resolvedUrl = new URL(location, currentUrl).href;
        currentUrl = resolvedUrl;
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove noisy elements
      $('script, style, nav, footer, header, noscript, svg, iframe, form, aside, .cookie-banner, .advertisement, [aria-hidden="true"]').remove();

      const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
      const metaDescription =
        $('meta[name="description"]').attr('content')?.trim() ||
        $('meta[property="og:description"]').attr('content')?.trim() ||
        '';

      const h1: string[] = [];
      $('h1').each((_, el) => {
        const text = $(el).text().trim();
        if (text && !h1.includes(text)) h1.push(text);
      });

      const h2: string[] = [];
      $('h2').each((_, el) => {
        const text = $(el).text().trim();
        if (text && !h2.includes(text) && h2.length < 15) h2.push(text);
      });

      // Extract body text from paragraphs and headings
      const contentBlocks: string[] = [];
      $('p, h1, h2, h3, article, section').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 20) {
          contentBlocks.push(text);
        }
      });

      const fullText = contentBlocks.join(' \n\n ').replace(/\s+/g, ' ').trim();
      const wordCount = fullText.split(/\s+/).filter(Boolean).length;

      return {
        success: true,
        url: currentUrl,
        title,
        metaDescription,
        h1,
        h2,
        wordCount,
        text: fullText.slice(0, 12000), // Cap for token optimization
        textSnippet: fullText.slice(0, 1000),
      };
    } catch (err: any) {
      return {
        success: false,
        url: currentUrl,
        error: err.message || 'Falha ao acessar a URL',
        title: '',
        metaDescription: '',
        h1: [],
        h2: [],
        wordCount: 0,
        text: '',
        textSnippet: '',
      };
    }
  }

  return {
    success: false,
    url: currentUrl,
    error: 'Número excessivo de redirecionamentos na URL.',
    title: '',
    metaDescription: '',
    h1: [],
    h2: [],
    wordCount: 0,
    text: '',
    textSnippet: '',
  };
}

// Healthcheck Routes (compatible with GCP / Cloud Run container probes)
app.get(['/api/health', '/health', '/healthz'], (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/fetch-url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ error: 'URL inválida. Deve começar com http:// ou https://' });
    }
    const result = await scrapeUrl(url);
    if (!result.success) {
      return res.status(422).json({ error: result.error });
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao processar URL' });
  }
});

// In-Memory SHA-256 Cache for Analysis Results (24h TTL)
interface AnalysisCacheEntry {
  payload: any;
  timestamp: number;
}
const analysisCache = new Map<string, AnalysisCacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 500;

function getAnalysisCacheKey(contentA: string, contentB: string, targetKeyword?: string): string {
  const normA = (contentA || '').trim();
  const normB = (contentB || '').trim();
  const normKw = (targetKeyword || '').trim().toLowerCase();
  return crypto.createHash('sha256').update(`${normA}:::${normB}:::${normKw}`).digest('hex');
}

app.post('/api/analyze-cannibalization', async (req: Request, res: Response) => {
  try {
    let { contentA, contentB, targetKeyword } = req.body;

    if (!contentA || !contentB) {
      return res.status(400).json({ error: 'Forneça ambos os conteúdos ou URLs para comparação.' });
    }

    // Check SHA-256 Analysis Cache
    const cacheKey = getAnalysisCacheKey(contentA, contentB, targetKeyword);
    const cached = analysisCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.payload);
    }

    let metaA: { title?: string; wordCount?: number; url?: string; h1?: string[]; h2?: string[] } = {};
    let metaB: { title?: string; wordCount?: number; url?: string; h1?: string[]; h2?: string[] } = {};

    // 1. Process URLs if provided, or extract headings from raw text
    if (typeof contentA === 'string' && contentA.trim().startsWith('http')) {
      const scraped = await scrapeUrl(contentA.trim());
      if (!scraped.success || scraped.text.length < 50) {
        return res.status(422).json({
          error: `Conteúdo A (URL): Não foi possível extrair texto suficiente da URL (${scraped.error || 'menos de 50 caracteres'}).`,
        });
      }
      metaA = {
        title: scraped.title,
        wordCount: scraped.wordCount,
        url: contentA.trim(),
        h1: scraped.h1,
        h2: scraped.h2,
      };
      const headingsA = [...scraped.h1, ...scraped.h2].join(', ');
      contentA = `Título: ${scraped.title}\nDescrição: ${scraped.metaDescription}\nHeadings: ${headingsA}\n\nConteúdo:\n${scraped.text}`;
    } else {
      const extractedA = extractHeadingsFromText(contentA);
      metaA = {
        title: extractedA.h1[0] || 'Conteúdo A',
        wordCount: contentA.split(/\s+/).filter(Boolean).length,
        h1: extractedA.h1,
        h2: extractedA.h2,
      };
    }

    if (typeof contentB === 'string' && contentB.trim().startsWith('http')) {
      const scraped = await scrapeUrl(contentB.trim());
      if (!scraped.success || scraped.text.length < 50) {
        return res.status(422).json({
          error: `Conteúdo B (URL): Não foi possível extrair texto suficiente da URL (${scraped.error || 'menos de 50 caracteres'}).`,
        });
      }
      metaB = {
        title: scraped.title,
        wordCount: scraped.wordCount,
        url: contentB.trim(),
        h1: scraped.h1,
        h2: scraped.h2,
      };
      const headingsB = [...scraped.h1, ...scraped.h2].join(', ');
      contentB = `Título: ${scraped.title}\nDescrição: ${scraped.metaDescription}\nHeadings: ${headingsB}\n\nConteúdo:\n${scraped.text}`;
    } else {
      const extractedB = extractHeadingsFromText(contentB);
      metaB = {
        title: extractedB.h1[0] || 'Conteúdo B',
        wordCount: contentB.split(/\s+/).filter(Boolean).length,
        h1: extractedB.h1,
        h2: extractedB.h2,
      };
    }

    if (contentA.trim().length < 40 || contentB.trim().length < 40) {
      return res.status(400).json({
        error: 'Os conteúdos fornecidos são muito curtos (mínimo de 40 caracteres cada).',
      });
    }

    const ai = getGeminiClient();

    // 2. Vector Embedding Cosine Similarity
    let vectorSimilarityPct = 0;
    let usedGeminiEmbedding = false;

    if (ai) {
      try {
        const [embedA, embedB] = await Promise.all([
          ai.models.embedContent({
            model: 'gemini-embedding-2-preview',
            contents: contentA.slice(0, 6000),
          }),
          ai.models.embedContent({
            model: 'gemini-embedding-2-preview',
            contents: contentB.slice(0, 6000),
          }),
        ]);

        const valuesA = embedA.embeddings?.[0]?.values;
        const valuesB = embedB.embeddings?.[0]?.values;

        if (valuesA && valuesB && valuesA.length > 0) {
          const rawCosSim = calculateCosineSimilarity(valuesA, valuesB);
          // Cosine similarity for normalized embeddings is typically [0, 1]
          vectorSimilarityPct = Math.round(Math.max(0, Math.min(1, rawCosSim)) * 10000) / 100;
          usedGeminiEmbedding = true;
        }
      } catch (embErr) {
        console.warn('Embedding API fallback to TF-IDF:', embErr);
      }
    }

    if (!usedGeminiEmbedding) {
      const tfidfCos = fallbackTfidfSimilarity(contentA, contentB);
      vectorSimilarityPct = Math.round(Math.max(0, Math.min(1, tfidfCos)) * 10000) / 100;
    }

    // 3. Deep Cognitive Analysis with Gemini 3.8 Flash
    let detailedAnalysis: any = null;

    if (ai) {
      try {
        const prompt = `Você é um Consultor Sênior de SEO Técnico e Estratégia de Conteúdo especializado em Canibalização de Palavras-Chave e Intenção de Busca Semântica (Search Intent).
Analise com rigor matemático e editorial estes dois conteúdos e determine se eles canibalizam entre si no Google SERP.

${targetKeyword ? `Palavra-chave foco declarada: "${targetKeyword}"` : ''}
Similaridade Vetorial Calculada (Cosine): ${vectorSimilarityPct}%

[CONTEÚDO A]
${contentA.slice(0, 4500)}

[CONTEÚDO B]
${contentB.slice(0, 4500)}

Responda ESTRITAMENTE em formato JSON com a estrutura solicitada, usando as regras clássicas de diagnóstico de SEO:
- Score >= 85%: CRITICAL (🚨 PERIGO: CANIBALIZAÇÃO CRÍTICA - mesma intenção, páginas competem diretamente)
- 60% <= Score < 85%: HIGH (⚠️ ALERTA: SOBREPOSIÇÃO FORTE - semelhanças e nuances, risco alto de disputa SERP)
- 30% <= Score < 60%: MODERATE (🔗 OPORTUNIDADE: CONTEXTO RELACIONADO - Topic Clusters, intenções complementares)
- Score < 30%: LOW (✅ DISTINTO: INTENÇÕES DIFERENTES - pouca relação semântica)`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                intentOverlapPct: {
                  type: Type.NUMBER,
                  description: 'Percentual de sobreposição da intenção de busca (0 a 100)',
                },
                overallScorePct: {
                  type: Type.NUMBER,
                  description: 'Pontuação composta final de canibalização semântica (0 a 100)',
                },
                riskLevel: {
                  type: Type.STRING,
                  enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'],
                  description: 'Nível de severidade do risco de canibalização',
                },
                statusHeadline: {
                  type: Type.STRING,
                  description: 'Título de status estilizado para o SEO (ex: 🚨 PERIGO: CANIBALIZAÇÃO CRÍTICA)',
                },
                diagnosisMessage: {
                  type: Type.STRING,
                  description: 'Diagnóstico detalhado sobre como o Google interpretará e rankeará esses dois conteúdos',
                },
                intentAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    contentA: {
                      type: Type.OBJECT,
                      properties: {
                        type: {
                          type: Type.STRING,
                          enum: ['Informativa', 'Comercial', 'Transacional', 'Navegacional', 'Mista'],
                        },
                        confidence: { type: Type.NUMBER },
                        explanation: { type: Type.STRING },
                        funnelStage: {
                          type: Type.STRING,
                          enum: ['Topo de Funil (ToFu)', 'Meio de Funil (MoFu)', 'Fundo de Funil (BoFu)'],
                        },
                      },
                      required: ['type', 'confidence', 'explanation', 'funnelStage'],
                    },
                    contentB: {
                      type: Type.OBJECT,
                      properties: {
                        type: {
                          type: Type.STRING,
                          enum: ['Informativa', 'Comercial', 'Transacional', 'Navegacional', 'Mista'],
                        },
                        confidence: { type: Type.NUMBER },
                        explanation: { type: Type.STRING },
                        funnelStage: {
                          type: Type.STRING,
                          enum: ['Topo de Funil (ToFu)', 'Meio de Funil (MoFu)', 'Fundo de Funil (BoFu)'],
                        },
                      },
                      required: ['type', 'confidence', 'explanation', 'funnelStage'],
                    },
                    intentMatchLevel: {
                      type: Type.STRING,
                      enum: ['Idêntica', 'Sobreposição Crítica', 'Sobreposição Parcial', 'Complementar', 'Distinta'],
                    },
                  },
                  required: ['contentA', 'contentB', 'intentMatchLevel'],
                },
                conflictingQueries: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      query: { type: Type.STRING, description: 'Termo de busca do Google onde há atrito' },
                      impact: {
                        type: Type.STRING,
                        enum: ['Alta Probabilidade de Canibalização', 'Sobreposição Moderada', 'Competição Secundária'],
                      },
                      reason: { type: Type.STRING, description: 'Por que ambas disputam esse termo' },
                    },
                    required: ['query', 'impact', 'reason'],
                  },
                },
                topicalComparison: {
                  type: Type.OBJECT,
                  properties: {
                    sharedEntitiesAndTopics: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Entidades, conceitos e subtemas presentes em ambos',
                    },
                    uniqueToA: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Ângulos e entidades exclusivas do Conteúdo A',
                    },
                    uniqueToB: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Ângulos e entidades exclusivas do Conteúdo B',
                    },
                  },
                  required: ['sharedEntitiesAndTopics', 'uniqueToA', 'uniqueToB'],
                },
                conflictPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      topic: { type: Type.STRING },
                      issue: { type: Type.STRING },
                      howToDifferentiate: { type: Type.STRING },
                    },
                    required: ['topic', 'issue', 'howToDifferentiate'],
                  },
                },
                recommendedAction: {
                  type: Type.OBJECT,
                  properties: {
                    strategy: {
                      type: Type.STRING,
                      enum: [
                        'CONSOLIDATION_301',
                        'CANONICAL',
                        'ANGLE_DIFFERENTIATION',
                        'TOPIC_CLUSTER_INTERNAL_LINKING',
                        'NO_ACTION_NEEDED',
                      ],
                    },
                    strategyName: { type: Type.STRING },
                    actionSummary: { type: Type.STRING },
                    stepByStep: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    suggestedMaster: {
                      type: Type.STRING,
                      enum: ['Conteúdo A', 'Conteúdo B', 'Fusão de ambos em uma nova URL', 'Manter ambos separados'],
                    },
                    internalLinkingPlan: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          source: { type: Type.STRING },
                          target: { type: Type.STRING },
                          suggestedAnchor: { type: Type.STRING },
                          context: { type: Type.STRING },
                        },
                        required: ['source', 'target', 'suggestedAnchor', 'context'],
                      },
                    },
                  },
                  required: ['strategy', 'strategyName', 'actionSummary', 'stepByStep', 'suggestedMaster'],
                },
                differentiationBlueprint: {
                  type: Type.OBJECT,
                  properties: {
                    angleA: { type: Type.STRING, description: 'Novo posicionamento estratégico para o Conteúdo A' },
                    angleB: { type: Type.STRING, description: 'Novo posicionamento estratégico para o Conteúdo B' },
                    h2SuggestionsA: { type: Type.ARRAY, items: { type: Type.STRING } },
                    h2SuggestionsB: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['angleA', 'angleB', 'h2SuggestionsA', 'h2SuggestionsB'],
                },
                headingsAnalysis: {
                  type: Type.OBJECT,
                  description: 'Comparação estrutural de tópicos e headings H2 entre Conteúdo A e B',
                  properties: {
                    comparisonList: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          topicH2: { type: Type.STRING },
                          status: {
                            type: Type.STRING,
                            enum: ['overlap', 'uniqueA', 'uniqueB'],
                          },
                          explanation: { type: Type.STRING },
                        },
                        required: ['topicH2', 'status', 'explanation'],
                      },
                    },
                  },
                  required: ['comparisonList'],
                },
              },
              required: [
                'intentOverlapPct',
                'overallScorePct',
                'riskLevel',
                'statusHeadline',
                'diagnosisMessage',
                'intentAnalysis',
                'conflictingQueries',
                'topicalComparison',
                'conflictPoints',
                'recommendedAction',
              ],
            },
          },
        });

        if (response.text) {
          detailedAnalysis = JSON.parse(response.text);
        }
      } catch (geminiErr) {
        console.error('Gemini content generation error:', geminiErr);
      }
    }

    // Fallback if detailed Gemini analysis failed or no key
    if (!detailedAnalysis) {
      const score = vectorSimilarityPct;
      let riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
      let statusHeadline = '✅ DISTINTO: INTENÇÕES DIFERENTES';
      let msg = 'Pouca relação semântica detectada entre os conteúdos.';
      let strategy: 'CONSOLIDATION_301' | 'ANGLE_DIFFERENTIATION' | 'TOPIC_CLUSTER_INTERNAL_LINKING' | 'NO_ACTION_NEEDED' = 'NO_ACTION_NEEDED';
      let actionSummary = 'Nenhuma ação crítica necessária quanto a canibalização.';

      if (score >= 85) {
        riskLevel = 'CRITICAL';
        statusHeadline = '🚨 PERIGO: CANIBALIZAÇÃO CRÍTICA';
        msg = 'Estes conteúdos atendem praticamente à mesma intenção de busca. O Google terá dificuldade em escolher qual rankear.';
        strategy = 'CONSOLIDATION_301';
        actionSummary = 'Canonical Tag (escolha um principal) ou Redirecionamento 301 (fundir conteúdos).';
      } else if (score >= 60) {
        riskLevel = 'HIGH';
        statusHeadline = '⚠️ ALERTA: SOBREPOSIÇÃO FORTE';
        msg = 'Há muitas semelhanças, mas nuances diferentes. Podem competir se não estiverem bem diferenciados.';
        strategy = 'ANGLE_DIFFERENTIATION';
        actionSummary = 'Diferencie os ângulos (ex: um guia prático vs. teoria) ou faça a fusão se os domínios forem fracos.';
      } else if (score >= 30) {
        riskLevel = 'MODERATE';
        statusHeadline = '🔗 OPORTUNIDADE: CONTEXTO RELACIONADO';
        msg = "Os textos falam da mesma 'entidade' ou universo, mas cobrem aspectos distintos.";
        strategy = 'TOPIC_CLUSTER_INTERNAL_LINKING';
        actionSummary = 'Linkagem Interna agressiva! Use um para fortalecer a autoridade do outro (Topic Clusters).';
      }

      detailedAnalysis = {
        intentOverlapPct: score,
        overallScorePct: score,
        riskLevel,
        statusHeadline,
        diagnosisMessage: msg,
        intentAnalysis: {
          contentA: {
            type: 'Informativa',
            confidence: 85,
            explanation: 'Conteúdo explicativo voltado para esclarecer tópicos temáticos.',
            funnelStage: 'Topo de Funil (ToFu)',
          },
          contentB: {
            type: 'Informativa',
            confidence: 85,
            explanation: 'Conteúdo focado em abordar a mesma temática sob perspectiva paralela.',
            funnelStage: 'Topo de Funil (ToFu)',
          },
          intentMatchLevel: score >= 85 ? 'Idêntica' : score >= 60 ? 'Sobreposição Crítica' : 'Complementar',
        },
        conflictingQueries: [
          {
            query: targetKeyword || 'termo principal de busca',
            impact: score >= 60 ? 'Alta Probabilidade de Canibalização' : 'Competição Secundária',
            reason: 'Ambos os conteúdos contêm títulos e semântica com foco nas mesmas entidades de busca.',
          },
        ],
        topicalComparison: {
          sharedEntitiesAndTopics: ['Entidade primária do tema', 'Terminologia comum', 'Exemplos e definições básicas'],
          uniqueToA: ['Seção introdutória específica do Conteúdo A'],
          uniqueToB: ['Detalhes operacionais específicos do Conteúdo B'],
        },
        conflictPoints: [
          {
            topic: 'Intenção de Entrada',
            issue: 'Tanto A quanto B explicam conceitos de base redundantes.',
            howToDifferentiate: 'Centralizar a introdução no artigo pilar e aprofundar o secundário em especificidades práticas.',
          },
        ],
        recommendedAction: {
          strategy,
          strategyName: strategy === 'CONSOLIDATION_301' ? 'Redirecionamento 301 / Fusão de Conteúdo' : 'Diferenciação de Ângulo e Linkagem',
          actionSummary,
          stepByStep: [
            'Avalie o histórico de tráfego orgânico no Google Search Console de cada URL.',
            'Mapeie os backlinks ativos (Ahrefs/Semrush) para decidir qual manter como master.',
            'Implemente a diretriz recomendada (301, Canonical ou Linkagem Interna).',
          ],
          suggestedMaster: 'Conteúdo A',
        },
      };
    }

    // Assemble headingsAnalysis
    let headingsAnalysis = detailedAnalysis.headingsAnalysis;
    const headingsA: string[] = metaA.h2 || [];
    const headingsB: string[] = metaB.h2 || [];

    if (!headingsAnalysis || !headingsAnalysis.comparisonList || headingsAnalysis.comparisonList.length === 0) {
      const comparisonList: Array<{ topicH2: string; status: 'overlap' | 'uniqueA' | 'uniqueB'; explanation: string }> = [];

      if (headingsA.length > 0 || headingsB.length > 0) {
        const bNormalized = headingsB.map(h => ({ original: h, norm: h.toLowerCase().trim() }));
        const matchedBIndices = new Set<number>();

        for (const hA of headingsA) {
          const normA = hA.toLowerCase().trim();
          const matchIdx = bNormalized.findIndex((b, idx) => !matchedBIndices.has(idx) && (b.norm === normA || b.norm.includes(normA) || normA.includes(b.norm)));
          if (matchIdx !== -1) {
            matchedBIndices.add(matchIdx);
            comparisonList.push({
              topicH2: hA,
              status: 'overlap',
              explanation: `Abordado em ambos os conteúdos (em B: "${bNormalized[matchIdx].original}"). Conflito estrutural de heading.`,
            });
          } else {
            comparisonList.push({
              topicH2: hA,
              status: 'uniqueA',
              explanation: 'Subtópico abordado exclusivamente no Conteúdo A.',
            });
          }
        }

        headingsB.forEach((hB, idx) => {
          if (!matchedBIndices.has(idx)) {
            comparisonList.push({
              topicH2: hB,
              status: 'uniqueB',
              explanation: 'Subtópico abordado exclusivamente no Conteúdo B.',
            });
          }
        });
      }

      if (comparisonList.length === 0 && detailedAnalysis.topicalComparison) {
        (detailedAnalysis.topicalComparison.sharedEntitiesAndTopics || []).forEach((t: string) => {
          comparisonList.push({
            topicH2: t,
            status: 'overlap',
            explanation: 'Entidade e subtópico compartilhado em ambos os conteúdos.',
          });
        });
        (detailedAnalysis.topicalComparison.uniqueToA || []).forEach((t: string) => {
          comparisonList.push({
            topicH2: t,
            status: 'uniqueA',
            explanation: 'Subtópico exclusivo identificado no Conteúdo A.',
          });
        });
        (detailedAnalysis.topicalComparison.uniqueToB || []).forEach((t: string) => {
          comparisonList.push({
            topicH2: t,
            status: 'uniqueB',
            explanation: 'Subtópico exclusivo identificado no Conteúdo B.',
          });
        });
      }

      headingsAnalysis = {
        headingsA,
        headingsB,
        comparisonList,
      };
    } else {
      headingsAnalysis = {
        headingsA,
        headingsB,
        comparisonList: headingsAnalysis.comparisonList,
      };
    }

    const payload = {
      vectorSimilarityPct,
      intentOverlapPct: detailedAnalysis.intentOverlapPct || vectorSimilarityPct,
      overallScorePct: detailedAnalysis.overallScorePct || vectorSimilarityPct,
      riskLevel: detailedAnalysis.riskLevel,
      statusHeadline: detailedAnalysis.statusHeadline,
      diagnosisMessage: detailedAnalysis.diagnosisMessage,
      intentAnalysis: detailedAnalysis.intentAnalysis,
      conflictingQueries: detailedAnalysis.conflictingQueries || [],
      topicalComparison: detailedAnalysis.topicalComparison,
      conflictPoints: detailedAnalysis.conflictPoints || [],
      recommendedAction: detailedAnalysis.recommendedAction,
      differentiationBlueprint: detailedAnalysis.differentiationBlueprint,
      headingsAnalysis,
      metadataA: metaA,
      metadataB: metaB,
    };

    // Store in SHA-256 analysisCache
    if (analysisCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = analysisCache.keys().next().value;
      if (oldestKey) analysisCache.delete(oldestKey);
    }
    analysisCache.set(cacheKey, { payload, timestamp: Date.now() });

    res.setHeader('X-Cache', 'MISS');
    res.json(payload);
  } catch (error: any) {
    console.error('Error in analyze-cannibalization:', error);
    res.status(500).json({ error: error.message || 'Erro durante a análise de canibalização' });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  try {
    const isCompiledBundle = typeof __filename === 'string' && __filename.endsWith('.cjs');
    const hasBuiltDist = fs.existsSync(path.resolve(process.cwd(), 'dist', 'index.html')) ||
      (typeof __dirname === 'string' && fs.existsSync(path.resolve(__dirname, 'index.html')));
    const isProduction = process.env.NODE_ENV === 'production' || isCompiledBundle || (hasBuiltDist && process.env.NODE_ENV !== 'development');

    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('[STARTUP] Vite development middleware mounted');
    } else {
      // In production CJS bundle (dist/server.cjs), __dirname points directly to the dist directory.
      // We safely resolve distPath using path.resolve with fallback to process.cwd()/dist
      const safeDirname: string =
        typeof __dirname === 'string' && __dirname.length > 0
          ? __dirname
          : path.resolve(process.cwd(), 'dist');

      const distPath: string = path.resolve(safeDirname);
      const indexHtmlPath: string = path.resolve(distPath, 'index.html');
      console.log(`[STARTUP] Serving static assets from: ${distPath}`);

      if (fs.existsSync(indexHtmlPath)) {
        console.log(`[STARTUP] Found index.html at: ${indexHtmlPath}`);
      } else {
        console.warn(`[STARTUP WARNING] index.html not found at expected path: ${indexHtmlPath}`);
      }

      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        if (fs.existsSync(indexHtmlPath)) {
          res.sendFile(indexHtmlPath);
        } else {
          res.status(200).send(`<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Calculadora de Canibalização Semântica</title>
  </head>
  <body>
    <div id="root">Carregando aplicação...</div>
  </body>
</html>`);
        }
      });
    }

    console.log(`[STARTUP] Binding HTTP server to 0.0.0.0:${PORT}...`);
    const server = app.listen(PORT, '0.0.0.0', () => {
      const elapsed = Date.now() - bootStartTime;
      console.log(`[STARTUP SUCCESS] Calculadora de Canibalização Semântica ativa e escutando na porta ${PORT} (0.0.0.0:${PORT}) em ${elapsed}ms [NODE_ENV=${process.env.NODE_ENV || 'development'}]`);
      console.log(`[STARTUP READY] Container probes / health check disponível em http://0.0.0.0:${PORT}/health`);
    });

    // Enforce 300-second timeouts matching Cloud Run timeoutSeconds: 300
    server.timeout = 300000; // 300s
    server.requestTimeout = 300000; // 300s
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    server.on('error', (err: NodeJS.ErrnoException) => {
      console.error(`[CRITICAL STARTUP ERROR] Failed to bind to port ${PORT}:`, err);
      process.exit(1);
    });
  } catch (error) {
    console.error('[CRITICAL STARTUP ERROR] Exception during server initialization:', error);
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.error('[CRITICAL STARTUP ERROR] Fatal error in startServer execution:', err);
  process.exit(1);
});
