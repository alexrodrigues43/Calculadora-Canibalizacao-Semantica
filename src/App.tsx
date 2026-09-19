/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { PresetBar } from './components/PresetBar';
import { InputPanel } from './components/InputPanel';
import { ScoreBanner } from './components/ScoreBanner';
import { IntentComparison } from './components/IntentComparison';
import { ConflictQueries } from './components/ConflictQueries';
import { ActionPlan } from './components/ActionPlan';
import { GuideModal } from './components/GuideModal';
import { PaywallModal } from './components/PaywallModal';
import { AdminPanel } from './components/AdminPanel';
import { PRESET_SCENARIOS } from './data/presets';
import { CannibalizationAnalysisResult, PresetScenario } from './types';
import { recordSuccessfulUsage } from './lib/firebase';
import {
  Sparkles,
  AlertCircle,
  LayoutDashboard,
  Target,
  Swords,
  CheckCircle2,
  Lock,
} from 'lucide-react';

function MainApp() {
  const { user, userProfile, isAdmin, isActive, isPaywallOpen, paywallReason, openPaywall, closePaywall } = useAuth();

  // Start with Preset 1 (FIIs) preloaded so the user gets instant value
  const [contentA, setContentA] = useState<string>(PRESET_SCENARIOS[0].contentA.urlOrText);
  const [contentB, setContentB] = useState<string>(PRESET_SCENARIOS[0].contentB.urlOrText);
  const [targetKeyword, setTargetKeyword] = useState<string>('como investir em fundos imobiliarios');
  const [activePresetId, setActivePresetId] = useState<string | null>(PRESET_SCENARIOS[0].id);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CannibalizationAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'intent' | 'conflicts' | 'action'>('overview');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);

  const handleSelectPreset = (preset: PresetScenario) => {
    setActivePresetId(preset.id);
    setContentA(preset.contentA.urlOrText);
    setContentB(preset.contentB.urlOrText);
    if (preset.id === 'critica-fiis') {
      setTargetKeyword('como investir em fundos imobiliarios');
    } else if (preset.id === 'sobreposicao-tenis') {
      setTargetKeyword('melhores tenis de corrida');
    } else if (preset.id === 'topic-cluster-seo') {
      setTargetKeyword('seo e link building');
    } else {
      setTargetKeyword('');
    }
    setError(null);
  };

  const handleClear = () => {
    setContentA('');
    setContentB('');
    setTargetKeyword('');
    setActivePresetId(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    // Paywall Gate check
    if (!isActive) {
      openPaywall('Para executar o cálculo semântico com embeddings vetoriais Gemini e diagnóstico cognitivo de SERP, é necessário possuir uma conta ativa na Semântico.');
      return;
    }

    if (!contentA.trim() || !contentB.trim()) {
      setError('Por favor, preencha ambos os conteúdos ou forneça URLs.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-cannibalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentA: contentA.trim(),
          contentB: contentB.trim(),
          targetKeyword: targetKeyword.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar o cálculo semântico.');
      }

      setResult(data);
      setHistoryCount((prev) => prev + 1);

      // Increment usage count atomically in Firestore for the active user
      if (user) {
        await recordSuccessfulUsage(user.uid);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Ocorreu um erro ao calcular a canibalização.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!isActive) {
      openPaywall('Para copiar o relatório técnico de SEO e exportar o parecer de canibalização, é necessário possuir uma conta ativa.');
      return;
    }

    if (!result) return;

    const reportMarkdown = `# Relatório de Auditoria de Canibalização Semântica (SEO)
**Gerado por:** Calculadora de Canibalização Semântica (Semântico SEO AI Engine)
**Data:** ${new Date().toLocaleDateString('pt-BR')}

---

## 1. Veredito Geral
- **Pontuação Composta:** ${result.overallScorePct}%
- **Status:** ${result.statusHeadline}
- **Similaridade Vetorial de Cosseno:** ${result.vectorSimilarityPct}%
- **Sobreposição de Intenção de Busca:** ${result.intentOverlapPct}%

**Diagnóstico:**
${result.diagnosisMessage}

---

## 2. Intenção de Busca (Search Intent)
- **Conteúdo A:** ${result.intentAnalysis.contentA.type} (${result.intentAnalysis.contentA.funnelStage})
  - *Detalhes:* ${result.intentAnalysis.contentA.explanation}
- **Conteúdo B:** ${result.intentAnalysis.contentB.type} (${result.intentAnalysis.contentB.funnelStage})
  - *Detalhes:* ${result.intentAnalysis.contentB.explanation}
- **Compatibilidade:** ${result.intentAnalysis.intentMatchLevel}

---

## 3. Consultas em Conflito no Google SERP
${result.conflictingQueries.map((q) => `- "${q.query}" [${q.impact}]: ${q.reason}`).join('\n')}

---

## 4. Plano Estratégico de Resolução
- **Diretriz Técnica:** ${result.recommendedAction.strategyName}
- **Resumo:** ${result.recommendedAction.actionSummary}
- **Master URL Recomendado:** ${result.recommendedAction.suggestedMaster}

**Checklist de Implementação:**
${result.recommendedAction.stepByStep.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;

    navigator.clipboard.writeText(reportMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-semantico-grid text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Semântico App Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNewAnalysis={handleClear}
        historyCount={historyCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Presets Bar */}
        <PresetBar
          onSelectPreset={handleSelectPreset}
          activePresetId={activePresetId}
        />

        {/* Input Panel */}
        <InputPanel
          contentA={contentA}
          setContentA={(val) => {
            setContentA(val);
            setActivePresetId(null);
          }}
          contentB={contentB}
          setContentB={(val) => {
            setContentB(val);
            setActivePresetId(null);
          }}
          targetKeyword={targetKeyword}
          setTargetKeyword={setTargetKeyword}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onClear={handleClear}
          isActive={isActive}
          onTriggerPaywall={() => openPaywall()}
        />

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5">Aviso de Processamento:</strong>
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-800 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Hero Metric & Score */}
            <ScoreBanner result={result} />

            {/* Results Navigation Tabs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    activeTab === 'overview'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Visão Geral & Intenção</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('conflicts')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    activeTab === 'conflicts'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Conflitos SERP & Entidades</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('action')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    activeTab === 'action'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Plano de Ação Estratégico</span>
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <IntentComparison
                    intentAnalysis={result.intentAnalysis}
                    metadataA={result.metadataA}
                    metadataB={result.metadataB}
                  />

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setActiveTab('action')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-200/80 transition-colors"
                    >
                      <span>Ver Diretriz de Resolução Técnica Recomendada</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'conflicts' && (
                <ConflictQueries
                  conflictingQueries={result.conflictingQueries}
                  topicalComparison={result.topicalComparison}
                  conflictPoints={result.conflictPoints}
                />
              )}

              {activeTab === 'action' && (
                <ActionPlan
                  recommendedAction={result.recommendedAction}
                  differentiationBlueprint={result.differentiationBlueprint}
                  overallScore={result.overallScorePct}
                  onCopyFullReport={handleCopyReport}
                  isCopied={isCopied}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Standardized Semântico Footer */}
      <footer id="semantico-footer" className="border-t border-slate-200 bg-white py-5 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-950">Semântico</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-normal">Calculadora de Canibalização Semântica SEO</span>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-6 sm:gap-8 text-xs">
            <a href="https://semantico.com.br/" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-950 transition">Consultoria Semântico SEO</a>
            <a href="https://semantico.com.br/blog" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-950 transition">Blog</a>
            <a href="https://semantico.com.br/contato" target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-800 font-medium transition">Fale com um Especialista</a>
          </div>
        </div>
      </footer>

      {/* Guide / How it Works Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Real-time Paywall / Auth Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={closePaywall}
        reason={paywallReason}
      />

      {/* Admin Panel (Visible strictly for role: 'admin') */}
      {isAdmin && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
