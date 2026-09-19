import React, { useState } from 'react';
import { CannibalizationAnalysisResult } from '../types';
import {
  GitMerge,
  Link,
  Split,
  FileCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ListOrdered,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ActionPlanProps {
  recommendedAction: CannibalizationAnalysisResult['recommendedAction'];
  differentiationBlueprint?: CannibalizationAnalysisResult['differentiationBlueprint'];
  overallScore: number;
  onCopyFullReport: () => void;
  isCopied: boolean;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({
  recommendedAction,
  differentiationBlueprint,
  overallScore,
  onCopyFullReport,
  isCopied,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'internalLinks' | 'blueprint'>('roadmap');

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'CONSOLIDATION_301':
        return GitMerge;
      case 'CANONICAL':
        return FileCheck;
      case 'ANGLE_DIFFERENTIATION':
        return Split;
      case 'TOPIC_CLUSTER_INTERNAL_LINKING':
        return Link;
      default:
        return CheckCircle2;
    }
  };

  const Icon = getStrategyIcon(recommendedAction.strategy);

  return (
    <div className="space-y-5">
      {/* Strategy Header Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                Diretriz de Resolução Técnica
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {recommendedAction.strategyName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onCopyFullReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors self-start sm:self-auto"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Relatório Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Parecer SEO</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 block">
              Veredito Executivo:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {recommendedAction.actionSummary}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 text-xs flex flex-col justify-center">
            <span className="text-[11px] text-slate-400 mb-0.5">
              Conteúdo/URL Master Recomendado para Herdar Autoridade:
            </span>
            <span className="text-sm font-bold text-emerald-400">
              {recommendedAction.suggestedMaster}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'roadmap'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Passo a Passo de Execução</span>
        </button>

        {recommendedAction.internalLinkingPlan &&
          recommendedAction.internalLinkingPlan.length > 0 && (
            <button
              onClick={() => setActiveTab('internalLinks')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'internalLinks'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Linkagem Interna & Textos-Âncora</span>
            </button>
          )}

        {differentiationBlueprint && (
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'blueprint'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Blueprint de Re-otimização (H2)</span>
          </button>
        )}
      </div>

      {/* Tab 1: Step by Step */}
      {activeTab === 'roadmap' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
            <span>Checklist Técnico para o SEO / Webmaster:</span>
          </h4>

          <ol className="space-y-2.5">
            {recommendedAction.stepByStep.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 bg-white border border-slate-200/80 p-3 rounded-lg text-xs text-slate-700 shadow-2xs"
              >
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Tab 2: Internal Linking */}
      {activeTab === 'internalLinks' && recommendedAction.internalLinkingPlan && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-blue-600" />
            <span>Matriz Direcional de Links Internos (Topic Cluster)</span>
          </h4>

          <div className="space-y-2.5">
            {recommendedAction.internalLinkingPlan.map((plan, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-3.5 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1.5">
                  <span className="text-blue-700">{plan.source}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-indigo-700">{plan.target}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-slate-500 text-[11px]">Texto-âncora exato sugerido:</span>
                  <code className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 text-xs font-semibold">
                    "{plan.suggestedAnchor}"
                  </code>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong className="text-slate-700">Contexto de inserção:</strong>{' '}
                  {plan.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Blueprint */}
      {activeTab === 'blueprint' && differentiationBlueprint && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blueprint A */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                A
              </span>
              <span className="text-xs font-bold text-slate-900">
                Novo Posicionamento para Conteúdo A
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-3 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
              {differentiationBlueprint.angleA}
            </p>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              Estrutura de Headings H2 Recomendada:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {differentiationBlueprint.h2SuggestionsA.map((h2, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold shrink-0">H2:</span>
                  <span className="leading-snug">{h2}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Blueprint B */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                B
              </span>
              <span className="text-xs font-bold text-slate-900">
                Novo Posicionamento para Conteúdo B
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-3 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
              {differentiationBlueprint.angleB}
            </p>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              Estrutura de Headings H2 Recomendada:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {differentiationBlueprint.h2SuggestionsB.map((h2, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold shrink-0">H2:</span>
                  <span className="leading-snug">{h2}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
