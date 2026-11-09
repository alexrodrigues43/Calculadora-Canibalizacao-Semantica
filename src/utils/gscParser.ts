import { GscConflictRow } from '../types';

export function parseGscCsv(csvContent: string): GscConflictRow[] {
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('O arquivo CSV parece estar vazio ou não contém linhas de dados.');
  }

  // Detect delimiter (, or ;)
  const headerLine = lines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';
  const headers = headerLine
    .split(delimiter)
    .map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

  // Find column indices
  const queryIdx = headers.findIndex(
    (h) => h.includes('query') || h.includes('consulta') || h.includes('termo')
  );
  const pageIdx = headers.findIndex(
    (h) => h.includes('page') || h.includes('página') || h.includes('pagina') || h.includes('url')
  );
  const clicksIdx = headers.findIndex(
    (h) => h.includes('click') || h.includes('clique')
  );
  const impressionsIdx = headers.findIndex(
    (h) => h.includes('impression') || h.includes('impress')
  );
  const positionIdx = headers.findIndex(
    (h) => h.includes('position') || h.includes('posiç') || h.includes('posic')
  );

  if (queryIdx === -1 || pageIdx === -1) {
    throw new Error(
      'Não foram encontradas as colunas necessárias ("Query/Consulta" e "Page/Página") no CSV exportado do Google Search Console.'
    );
  }

  // Map entries by Query
  interface RawEntry {
    url: string;
    clicks: number;
    impressions: number;
    position: number;
  }

  const queryMap = new Map<string, RawEntry[]>();

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
    if (rawCols.length <= Math.max(queryIdx, pageIdx)) continue;

    const query = rawCols[queryIdx]?.trim();
    const url = rawCols[pageIdx]?.trim();

    if (!query || !url || !url.startsWith('http')) continue;

    const clicks = clicksIdx !== -1 ? parseInt(rawCols[clicksIdx]?.replace(/\D/g, '') || '0', 10) : 0;
    const impressions =
      impressionsIdx !== -1 ? parseInt(rawCols[impressionsIdx]?.replace(/\D/g, '') || '0', 10) : 0;
    const position =
      positionIdx !== -1 ? parseFloat(rawCols[positionIdx]?.replace(',', '.') || '0') : 0;

    const existing = queryMap.get(query) || [];

    // Avoid duplicate rows for the same query + exact url
    const duplicate = existing.find((e) => e.url === url);
    if (duplicate) {
      duplicate.clicks += clicks;
      duplicate.impressions += impressions;
    } else {
      existing.push({ url, clicks, impressions, position });
    }

    queryMap.set(query, existing);
  }

  // Filter queries where 2 or more distinct pages exist
  const conflicts: GscConflictRow[] = [];

  for (const [query, pages] of queryMap.entries()) {
    if (pages.length >= 2) {
      // Sort pages by clicks then impressions descending
      pages.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

      const topA = pages[0];
      const topB = pages[1];
      const totalImpressions = topA.impressions + topB.impressions;

      let severity: GscConflictRow['severity'] = 'MODERATE';
      if (topA.clicks > 0 && topB.clicks > 0) {
        severity = 'CRITICAL';
      } else if (totalImpressions >= 100 || (topA.position <= 20 && topB.position <= 20)) {
        severity = 'HIGH';
      }

      conflicts.push({
        query,
        urlA: topA.url,
        clicksA: topA.clicks,
        impressionsA: topA.impressions,
        positionA: Math.round(topA.position * 10) / 10,
        urlB: topB.url,
        clicksB: topB.clicks,
        impressionsB: topB.impressions,
        positionB: Math.round(topB.position * 10) / 10,
        totalImpressions,
        severity,
      });
    }
  }

  // Sort conflicts by severity then total impressions
  const severityWeight = { CRITICAL: 3, HIGH: 2, MODERATE: 1 };
  conflicts.sort((a, b) => {
    const diff = severityWeight[b.severity] - severityWeight[a.severity];
    if (diff !== 0) return diff;
    return b.totalImpressions - a.totalImpressions;
  });

  return conflicts;
}
