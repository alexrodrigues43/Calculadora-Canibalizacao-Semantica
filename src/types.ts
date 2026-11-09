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

  headingsAnalysis?: {
    headingsA: string[];
    headingsB: string[];
    comparisonList: {
      topicH2: string;
      status: 'overlap' | 'uniqueA' | 'uniqueB';
      explanation: string;
    }[];
  };

  metadataA?: {
    title?: string;
    wordCount?: number;
    url?: string;
    h1?: string[];
    h2?: string[];
  };
  metadataB?: {
    title?: string;
    wordCount?: number;
    url?: string;
    h1?: string[];
    h2?: string[];
  };
}

export interface CopywriterBriefing {
  masterTitle: string;
  secondaryTitle: string;
  strategy: string;
  actionSummary: string;
  coreObjective: string;
  actionChecklist: string[];
  sectionsToMoveOrMerge: string[];
  secondaryAngle: string;
  recommendedH2sSecondary: string[];
  internalLinkDirective?: {
    source: string;
    target: string;
    anchorText: string;
    context: string;
  };
  warningsAndTips: string[];
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
export type SubscriptionPlan = 'trial' | 'specialist' | 'agency' | 'enterprise' | 'monthly' | 'annual' | 'lifetime';
export type UserPlan = SubscriptionPlan;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  plan: SubscriptionPlan;
  creditsBalance?: number;
  creditsUsed?: number;
  planExpiresAt?: string;
  lastAppUsed?: string;
  usageCount: number;
  notes: string;
  createdAt: string;
  lastLoginAt: string;
}

export type TrafficLevel = 'A_DOMINANT' | 'B_DOMINANT' | 'BOTH_ACTIVE' | 'NEITHER_SIGNIFICANT';
export type BacklinkProfile = 'A_STRONGER' | 'B_STRONGER' | 'BOTH_IMPORTANT' | 'NEITHER_RELEVANT';
export type IntentOverlapType = 'IDENTICAL_DUPLICATE' | 'PILLAR_VS_SUBTOPIC' | 'DIFFERENT_ANGLES';
export type BusinessValue = 'A_HIGH_CONVERT' | 'B_HIGH_CONVERT' | 'EDITORIAL_ONLY';

export interface DecisionSimulationResult {
  decision: '301_REDIRECT_B_TO_A' | '301_REDIRECT_A_TO_B' | 'CANONICAL_TAG' | 'ANGLE_DIFFERENTIATION' | 'MERGE_INTO_NEW_URL';
  decisionTitle: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  executiveRationale: string;
  trafficImpactAnalysis: string;
  actionRoadmap: string[];
  preservationChecklist: string[];
  monitoringGuidance: string[];
  rollbackPlan: string;
}

export interface GscConflictRow {
  query: string;
  urlA: string;
  clicksA: number;
  impressionsA: number;
  positionA: number;
  urlB: string;
  clicksB: number;
  impressionsB: number;
  positionB: number;
  totalImpressions: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

