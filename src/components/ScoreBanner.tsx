import React from 'react';
import { CannibalizationAnalysisResult, RiskLevel } from '../types';
import {
  AlertOctagon,
  AlertTriangle,
  Link2,
  CheckCircle2,
  Sparkles,
  Activity,
  Compass,
} from 'lucide-react';

interface ScoreBannerProps {
  result: CannibalizationAnalysisResult;
}

export const ScoreBanner: React.FC<ScoreBannerProps> = ({ result }) => {
  const getTheme = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return {
          barColor: 'bg-rose-500',
          textColor: 'text-rose-600',
          borderColor: 'border-rose-200',
          bgBadge: 'bg-rose-50 border-rose-200 text-rose-800',
          quoteBorder: 'border-l-rose-500',
          icon: AlertOctagon,
        };
      case 'HIGH':
        return {
          barColor: 'bg-amber-500',
          textColor: 'text-amber-600',
          borderColor: 'border-amber-200',
          bgBadge: 'bg-amber-50 border-amber-200 text-amber-800',
          quoteBorder: 'border-l-amber-500',
          icon: AlertTriangle,
        };
      case 'MODERATE':
        return {
          barColor: 'bg-blue-500',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          bgBadge: 'bg-blue-50 border-blue-200 text-blue-800',
          quoteBorder: 'border-l-blue-500',
          icon: Link2,
        };
      case 'LOW':
        return {
          barColor: 'bg-emerald-500',
          textColor: 'text-emerald-600',
          borderColor: 'border-emerald-200',
          bgBadge: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          quoteBorder: 'border-l-emerald-500',
          icon: CheckCircle2,
        };
    }
  };

  const theme = getTheme(result.riskLevel);
  const Icon = theme.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
      {/* Top row: Score + Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${theme.bgBadge} shrink-0`}
          >
            <Icon className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-3xl font-extrabold tracking-tight ${theme.textColor}`}>
                {result.overallScorePct}%
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Similaridade Semântica Composta
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {result.statusHeadline}
            </h2>
          </div>
        </div>

        {/* Dual Sub-metrics */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              <span>Distância Vetorial Cosine:</span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              {result.vectorSimilarityPct}%
              <span className="text-[10px] text-slate-400 font-normal ml-1">
                (Embeddings Gemini 2)
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>Sobreposição de Intenção:</span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              {result.intentOverlapPct}%
              <span className="text-[10px] text-slate-400 font-normal ml-1">
                (Search Intent Match)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar (Faithful to Colab style, modernized) */}
      <div className="my-5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
          <span>0% (Distinto)</span>
          <span>30% (Topic Cluster)</span>
          <span>60% (Sobreposição)</span>
          <span>85% (Canibalização Crítica)</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${theme.barColor}`}
            style={{ width: `${Math.max(4, Math.min(100, result.overallScorePct))}%` }}
          />
        </div>
      </div>

      {/* Diagnosis & Immediate Action Box */}
      <div className="space-y-3">
        <p className="text-xs text-slate-700 leading-relaxed">
          {result.diagnosisMessage}
        </p>

        <div
          className={`p-3.5 bg-slate-50 rounded-xl border-l-4 ${theme.quoteBorder} text-xs text-slate-800`}
        >
          <div className="font-semibold mb-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Ação Recomendada Imediata:</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            {result.recommendedAction.actionSummary}
          </p>
        </div>
      </div>
    </div>
  );
};
