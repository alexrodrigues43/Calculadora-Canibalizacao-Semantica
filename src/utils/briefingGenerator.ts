import { CannibalizationAnalysisResult, CopywriterBriefing } from '../types';

export function generateBriefing(result: CannibalizationAnalysisResult): CopywriterBriefing {
  const isMasterB = result.recommendedAction.suggestedMaster === 'Conteúdo B';
  const masterTitle = isMasterB
    ? result.metadataB?.title || 'Conteúdo B (Master Prioritário)'
    : result.metadataA?.title || 'Conteúdo A (Master Prioritário)';
  const secondaryTitle = isMasterB
    ? result.metadataA?.title || 'Conteúdo A (Secundário / Ação Necessária)'
    : result.metadataB?.title || 'Conteúdo B (Secundário / Ação Necessária)';

  let coreObjective = '';
  const warningsAndTips = [
    'Preserve todas as entidades e termos técnicos essenciais já indexados no Google.',
    'Não realize cópia literal (Ctrl+C / Ctrl+V): sintetize e reescreva para manter tom de voz unificado.',
    'Atualize a data de publicação (modified_time) e a meta description para refletir o conteúdo atualizado.',
    'Certifique-se de que a intenção de busca principal esteja clara nos primeiros 150 caracteres.',
  ];

  switch (result.recommendedAction.strategy) {
    case 'CONSOLIDATION_301':
      coreObjective =
        'Fundir o conteúdo secundário no artigo principal (Master), absorvendo suas seções valiosas e aplicando Redirecionamento 301 na URL secundária para concentrar a autoridade orgânica.';
      warningsAndTips.push('Antes de aplicar o 301, confirme se a URL secundária não possui campanhas pagas ativas.');
      break;
    case 'CANONICAL':
      coreObjective =
        'Manter ambos os artigos publicados, mas configurar a tag rel="canonical" apontando da URL secundária para a principal, unificando a consolidação de sinais na SERP.';
      break;
    case 'ANGLE_DIFFERENTIATION':
      coreObjective =
        'Reposicionar o artigo secundário com um ângulo exclusivo (ex: tutorial prático, checklist operacional ou foco B2B/B2C), eliminando a sobreposição de intenção com o artigo principal.';
      warningsAndTips.push('Remova do artigo secundário explicações introdutórias redundantes que já estão completas no artigo master.');
      break;
    case 'TOPIC_CLUSTER_INTERNAL_LINKING':
      coreObjective =
        'Construir arquitetura de Topic Cluster: o artigo principal atua como Página Pilar (Pillar Page) e o secundário como Conteúdo Satélite, interligados com âncoras temáticas precisas.';
      break;
    default:
      coreObjective =
        'Garantir diferenciação contínua e monitoramento de palavras-chave para evitar dispersão de cliques na SERP.';
  }

  // Identify sections to move or merge based on comparisonList
  const sectionsToMoveOrMerge: string[] = [];
  if (result.headingsAnalysis?.comparisonList) {
    result.headingsAnalysis.comparisonList.forEach((item) => {
      if (item.status === 'overlap') {
        sectionsToMoveOrMerge.push(
          `[Sobreposição] ${item.topicH2}: Unificar informações e evitar duplicidade de parágrafos.`
        );
      } else if (result.recommendedAction.strategy === 'CONSOLIDATION_301' && item.status === 'uniqueB') {
        sectionsToMoveOrMerge.push(
          `[Migração] ${item.topicH2}: Transferir e incorporar integralmente dentro do artigo Master.`
        );
      }
    });
  }

  if (sectionsToMoveOrMerge.length === 0 && result.topicalComparison?.sharedEntitiesAndTopics) {
    result.topicalComparison.sharedEntitiesAndTopics.forEach((topic) => {
      sectionsToMoveOrMerge.push(`Consolidar cobertura sobre: "${topic}"`);
    });
  }

  // Recommended H2s for secondary or master
  const recommendedH2sSecondary =
    result.differentiationBlueprint?.h2SuggestionsB && result.differentiationBlueprint.h2SuggestionsB.length > 0
      ? result.differentiationBlueprint.h2SuggestionsB
      : [
          'Guia Passo a Passo Prático de Aplicação',
          'Erros Comuns e Como Evitá-los',
          'Estudo de Caso e Exemplos Reais',
          'Checklist Rápido para Tomada de Decisão',
        ];

  // Internal link directive
  const firstLink = result.recommendedAction.internalLinkingPlan?.[0];
  const internalLinkDirective = firstLink
    ? {
        source: firstLink.source,
        target: firstLink.target,
        anchorText: firstLink.suggestedAnchor,
        context: firstLink.context,
      }
    : undefined;

  // Action checklist
  const actionChecklist = [
    `Revisar o histórico de palavras-chave no Google Search Console para ambas as URLs.`,
    ...result.recommendedAction.stepByStep,
    `Inserir link interno contextual com a âncora recomendada para transferir PageRank interno.`,
    `Solicitar reindexação da URL principal via Google Search Console (Inspeção de URL).`,
  ];

  return {
    masterTitle,
    secondaryTitle,
    strategy: result.recommendedAction.strategyName,
    actionSummary: result.recommendedAction.actionSummary,
    coreObjective,
    actionChecklist,
    sectionsToMoveOrMerge: sectionsToMoveOrMerge.slice(0, 6),
    secondaryAngle:
      result.differentiationBlueprint?.angleB ||
      'Abordagem orientada a resolução de dúvidas específicas, casos de uso avançados e templates.',
    recommendedH2sSecondary,
    internalLinkDirective,
    warningsAndTips,
  };
}

export function formatBriefingMarkdown(briefing: CopywriterBriefing): string {
  return `# 📝 BRIEFING TÉCNICO DE SEO PARA REDATOR
**Gerado por:** Calculadora de Canibalização Semântica (Semântico SEO)
**Data de Emissão:** ${new Date().toLocaleDateString('pt-BR')}

---

## 🎯 1. VISÃO GERAL & OBJETIVO
- **Artigo Master (Prioritário):** ${briefing.masterTitle}
- **Artigo Secundário / Alvo:** ${briefing.secondaryTitle}
- **Diretriz de Resolução Técnica:** ${briefing.strategy}

### Objetivo Principal da Pauta:
> ${briefing.coreObjective}

**Resumo Estratégico:**
${briefing.actionSummary}

---

## ✅ 2. CHECKLIST DE EXECUÇÃO DO REDATOR
${briefing.actionChecklist.map((item, index) => `- [ ] **Passo ${index + 1}:** ${item}`).join('\n')}

---

## 🔀 3. SEÇÕES A MIGRAR, FUNDIR OU REESCREVER
${briefing.sectionsToMoveOrMerge.length > 0 ? briefing.sectionsToMoveOrMerge.map((s) => `- ${s}`).join('\n') : '- Nenhuma seção sobreposta crítica a migrar.'}

---

## 💡 4. NOVO ÂNGULO SUGERIDO & ESTRUTURA DE H2s
**Ângulo Editorial Recomendado:**
${briefing.secondaryAngle}

**Estrutura de Cabeçalhos (H2) Sugerida:**
${briefing.recommendedH2sSecondary.map((h2) => `- <h2>${h2}</h2>`).join('\n')}

---

${
  briefing.internalLinkDirective
    ? `## 🔗 5. DIRETRIZ DE LINKAGEM INTERNA OBRIGATÓRIA
- **Origem:** ${briefing.internalLinkDirective.source}
- **Destino:** ${briefing.internalLinkDirective.target}
- **Texto-Âncora Exato:** \`${briefing.internalLinkDirective.anchorText}\`
- **Contexto de Inserção:** ${briefing.internalLinkDirective.context}

---
`
    : ''
}
## ⚠️ 6. DIRETRIZES DE QUALIDADE & BOAS PRÁTICAS
${briefing.warningsAndTips.map((tip) => `- ${tip}`).join('\n')}
`;
}
