export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type PrimaryStrategy =
  | 'CONSOLIDATION_301'
  | 'CANONICAL'
  | 'ANGLE_DIFFERENTIATION'
  | 'TOPIC_CLUSTER_INTERNAL_LINKING'
  | 'NO_ACTION_NEEDED';

export interface ExtractedUrlData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  wordCount: number;
  textSnippet: string;
  error?: string;
}

export interface IntentDetail {
  type: 'Informativa' | 'Comercial' | 'Transacional' | 'Navegacional' | 'Mista';
  confidence: number;
  explanation: string;
  funnelStage: 'Topo de Funil (ToFu)' | 'Meio de Funil (MoFu)' | 'Fundo de Funil (BoFu)';
}

export interface CannibalizationAnalysisResult {
  vectorSimilarityPct: number;
  intentOverlapPct: number;
  overallScorePct: number;
  riskLevel: RiskLevel;
  statusHeadline: string;
  diagnosisMessage: string;
  
  intentAnalysis: {
    contentA: IntentDetail;
    contentB: IntentDetail;
    intentMatchLevel: 'Idêntica' | 'Sobreposição Crítica' | 'Sobreposição Parcial' | 'Complementar' | 'Distinta';
  };
  
  conflictingQueries: {
    query: string;
    impact: 'Alta Probabilidade de Canibalização' | 'Sobreposição Moderada' | 'Competição Secundária';
    reason: string;
  }[];

  topicalComparison: {
    sharedEntitiesAndTopics: string[];
    uniqueToA: string[];
    uniqueToB: string[];
  };

  conflictPoints: {
    topic: string;
    issue: string;
    howToDifferentiate: string;
  }[];

  recommendedAction: {
    strategy: PrimaryStrategy;
    strategyName: string;
    actionSummary: string;
    stepByStep: string[];
    suggestedMaster: 'Conteúdo A' | 'Conteúdo B' | 'Fusão de ambos em uma nova URL' | 'Manter ambos separados';
    internalLinkingPlan?: {
      source: string;
      target: string;
      suggestedAnchor: string;
      context: string;
    }[];
  };

  differentiationBlueprint?: {
    angleA: string;
    angleB: string;
    h2SuggestionsA: string[];
    h2SuggestionsB: string[];
  };

  metadataA?: {
    title?: string;
    wordCount?: number;
    url?: string;
  };
  metadataB?: {
    title?: string;
    wordCount?: number;
    url?: string;
  };
}

export interface PresetScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedRisk: RiskLevel;
  contentA: {
    label: string;
    urlOrText: string;
  };
  contentB: {
    label: string;
    urlOrText: string;
  };
}

export type UserRole = 'admin' | 'client';
export type UserStatus = 'pending' | 'active' | 'blocked' | 'expired';
export type UserPlan = 'trial' | 'monthly' | 'annual' | 'lifetime';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  plan: UserPlan;
  usageCount: number;
  notes: string;
  createdAt: string;
  lastLoginAt: string;
}
