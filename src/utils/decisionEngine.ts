import {
  TrafficLevel,
  BacklinkProfile,
  IntentOverlapType,
  BusinessValue,
  DecisionSimulationResult,
} from '../types';

interface SimulationInput {
  traffic: TrafficLevel;
  backlinks: BacklinkProfile;
  intentOverlap: IntentOverlapType;
  business: BusinessValue;
  similarityScore: number;
  urlOrTitleA?: string;
  urlOrTitleB?: string;
}

export function simulate301Decision(input: SimulationInput): DecisionSimulationResult {
  const { traffic, backlinks, intentOverlap, business, similarityScore } = input;
  const nameA = input.urlOrTitleA || 'Conteúdo A';
  const nameB = input.urlOrTitleB || 'Conteúdo B';

  let riskScore = 20; // Base baseline
  let decision: DecisionSimulationResult['decision'] = '301_REDIRECT_B_TO_A';
  let decisionTitle = '';
  let riskLevel: DecisionSimulationResult['riskLevel'] = 'LOW';
  let executiveRationale = '';
  let trafficImpactAnalysis = '';
  const actionRoadmap: string[] = [];
  const preservationChecklist: string[] = [];
  const monitoringGuidance: string[] = [];
  let rollbackPlan = '';

  // 1. Evaluate Traffic conflicts
  if (traffic === 'BOTH_ACTIVE') {
    riskScore += 45;
  } else if (traffic === 'B_DOMINANT') {
    riskScore += 10;
  } else if (traffic === 'A_DOMINANT') {
    riskScore += 5;
  }

  // 2. Evaluate Backlink conflicts
  if (backlinks === 'BOTH_IMPORTANT') {
    riskScore += 25;
  } else if (traffic === 'A_DOMINANT' && backlinks === 'B_STRONGER') {
    // Cross-signal hazard (A has traffic, B has PageRank)
    riskScore += 35;
  } else if (traffic === 'B_DOMINANT' && backlinks === 'A_STRONGER') {
    riskScore += 35;
  }

  // 3. Evaluate Business & Intent
  if (business === 'A_HIGH_CONVERT' || business === 'B_HIGH_CONVERT') {
    riskScore += 20;
  }
  if (intentOverlap === 'DIFFERENT_ANGLES') {
    riskScore += 15;
  }

  riskScore = Math.min(Math.max(riskScore, 10), 98);

  // Determine Risk Level badge
  if (riskScore >= 75) {
    riskLevel = 'CRITICAL';
  } else if (riskScore >= 55) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 35) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
  }

  // Determine Core Decision
  if (traffic === 'BOTH_ACTIVE' && intentOverlap !== 'IDENTICAL_DUPLICATE') {
    // Both URLs get significant traffic for different queries -> NEVER do 301 blind
    decision = 'ANGLE_DIFFERENTIATION';
    decisionTitle = `Diferenciar Ângulos Editoriais e Manter Ambas as URLs`;
    executiveRationale = `Ambas as URLs possuem tráfego orgânico ativo consolidado. Aplicar um redirecionamento 301 agora eliminaria as posições secundárias da URL absorvida, causando queda líquida imediata de impressões no Google Search Console.`;
    trafficImpactAnalysis = `Risco de perda de até 30% a 50% das visitas da URL redirecionada para consultas de cauda longa (long-tail) se for feito 301. A diferenciação preserva 100% do tráfego de ambas.`;

    actionRoadmap.push(`Mantenha as duas URLs no ar e indexadas.`);
    actionRoadmap.push(`No Search Console, filtre as consultas que trazem cliques para ${nameA} e separe das de ${nameB}.`);
    actionRoadmap.push(`Reescreva as introduções e H2s para que cada página responda estritamente ao seu grupo de consultas.`);
    actionRoadmap.push(`Insira um link interno recíproco conectando o artigo pilar ao tutorial satélite.`);

    preservationChecklist.push(`Auditar os 20 principais termos de busca de cada URL antes de alterar qualquer parágrafo.`);
    preservationChecklist.push(`Não alterar a slug (URL) de nenhuma das duas páginas.`);

    rollbackPlan = `Como nenhuma URL foi redirecionada, o risco de perda é mínimo. Se uma página oscilar posições, basta reforçar a densidade de entidades semânticas no primeiro parágrafo.`;
  } else if (traffic === 'B_DOMINANT' && (backlinks === 'B_STRONGER' || backlinks === 'NEITHER_RELEVANT')) {
    // B is clearly dominant in traffic and links
    decision = '301_REDIRECT_A_TO_B';
    decisionTitle = `Redirecionamento 301: Consolidar ${nameA} dentro de ${nameB}`;
    executiveRationale = `${nameB} já concentra a autoridade e o tráfego do domínio. Manter ${nameA} ativo apenas dispersa CTR e gera canibalização inútil.`;
    trafficImpactAnalysis = `Ganho previsto: A autoridade de links de ${nameA} somada à relevância de ${nameB} deve impulsionar ${nameB} para o Top 3 da SERP nas próximas 3 a 6 semanas.`;

    actionRoadmap.push(`Copie trechos valiosos e exclusivos de ${nameA} e insira em seções complementares de ${nameB}.`);
    actionRoadmap.push(`Configure o Redirecionamento 301 permanente no servidor (.htaccess, Nginx ou Cloudflare) de ${nameA} apontando para ${nameB}.`);
    actionRoadmap.push(`Atualize todos os links internos do site que apontavam para ${nameA} para apontarem direto para ${nameB}.`);

    preservationChecklist.push(`Certifique-se de que a página de destino (${nameB}) aborde a intenção da página redirecionada.`);
    preservationChecklist.push(`Verifique se ${nameA} não está sendo usada em anúncios pagos ativos no Google Ads.`);

    rollbackPlan = `Caso haja queda imprevista (rara neste cenário), o redirecionamento 301 pode ser removido e ${nameA} restaurada com backup em até 14 dias sem perda definitiva no índice do Google.`;
  } else if (traffic === 'BOTH_ACTIVE' && intentOverlap === 'IDENTICAL_DUPLICATE') {
    // Both active but completely identical intent -> Canonical tag or 301 with high care
    decision = 'CANONICAL_TAG';
    decisionTitle = `Aplicar Canonical Tag Provisória para Teste de SERP`;
    executiveRationale = `Ambas as URLs recebem acessos, porém disputam a exata mesma intenção. Um 301 imediato é agressivo; a Canonical Tag informa ao Google qual é a preferida sem desativar a navegação do usuário.`;
    trafficImpactAnalysis = `O Google transferirá gradualmente o sinal de rankeamento para a URL canonical sem risco de erro 404 ou quebra imediata de experiência.`;

    actionRoadmap.push(`Defina qual URL possui maior conversão e autoridade.`);
    actionRoadmap.push(`Insira na URL secundária a tag: <link rel="canonical" href="[URL_MASTER]" />.`);
    actionRoadmap.push(`Acompanhe por 30 dias no GSC a transferência de impressões.`);
    actionRoadmap.push(`Se a URL Master subir com sucesso, conclua com o Redirecionamento 301 definitivo.`);

    preservationChecklist.push(`Não aplicar 'noindex' junto com 'canonical' (erro gravíssimo).`);
    preservationChecklist.push(`Garantir que a URL Master não aponte canonical de volta para a secundária (loop de canonical).`);

    rollbackPlan = `Basta remover a tag rel="canonical" da página secundária para reverter a indicação imediatamente.`;
  } else {
    // Default safe route: 301 from B to A (A is master)
    decision = '301_REDIRECT_B_TO_A';
    decisionTitle = `Redirecionamento 301 Seguro: Consolidar ${nameB} dentro de ${nameA}`;
    executiveRationale = `${nameA} é o ativo prioritário para retenção de autoridade. ${nameB} deve ser absorvida para unificar sinais de rankeamento e eliminar a dispersão de cliques na SERP.`;
    trafficImpactAnalysis = `Risco controlado. Como ${nameB} tem menor volume e relevância, o impacto de perda é desprezível e a URL ${nameA} herda o PageRank residual.`;

    actionRoadmap.push(`Faça a fusão do conteúdo: integre dados e subtópicos úteis de ${nameB} no corpo de ${nameA}.`);
    actionRoadmap.push(`Implemente o redirecionamento 301 no servidor de ${nameB} -> ${nameA}.`);
    actionRoadmap.push(`Atualize links internos e o sitemap.xml removendo a URL ${nameB}.`);
    actionRoadmap.push(`Solicite a reindexação de ${nameA} na ferramenta de Inspeção de URL do Search Console.`);

    preservationChecklist.push(`Confirmar que o código de status HTTP retornado é exatamente 301 (Moved Permanently), não 302.`);
    preservationChecklist.push(`Preservar parâmetros de campanha caso ${nameB} receba tráfego de redes sociais.`);

    rollbackPlan = `Caso necessário, remover a regra de redirect no servidor e solicitar nova indexação de ${nameB}.`;
  }

  monitoringGuidance.push(`Monitore semanalmente a métrica de "Posição Média" no Google Search Console.`);
  monitoringGuidance.push(`Verifique se a URL Master herdou as consultas de cauda longa da URL redirecionada.`);
  monitoringGuidance.push(`Acompanhe a taxa de rejeição e tempo de permanência da página Master após a fusão.`);

  return {
    decision,
    decisionTitle,
    riskLevel,
    riskScore,
    executiveRationale,
    trafficImpactAnalysis,
    actionRoadmap,
    preservationChecklist,
    monitoringGuidance,
    rollbackPlan,
  };
}
