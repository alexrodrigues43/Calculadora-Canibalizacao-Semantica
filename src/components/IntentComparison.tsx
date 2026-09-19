import React from 'react';
import { CannibalizationAnalysisResult } from '../types';
import { Target, Layers, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface IntentComparisonProps {
  intentAnalysis: CannibalizationAnalysisResult['intentAnalysis'];
  metadataA?: CannibalizationAnalysisResult['metadataA'];
  metadataB?: CannibalizationAnalysisResult['metadataB'];
}

export const IntentComparison: React.FC<IntentComparisonProps> = ({
  intentAnalysis,
  metadataA,
  metadataB,
}) => {
  const { contentA, contentB, intentMatchLevel } = intentAnalysis;

  const getIntentBadgeColor = (type: string) => {
    switch (type) {
      case 'Informativa':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Comercial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Transacional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Navegacional':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getFunnelBadgeColor = (stage: string) => {
    if (stage.includes('ToFu') || stage.includes('Topo')) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    if (stage.includes('MoFu') || stage.includes('Meio')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    return 'bg-violet-50 text-violet-700 border-violet-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Comparativo de Intenção de Busca (Search Intent)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500">Nível de Sobreposição:</span>
          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {intentMatchLevel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Content A Card */}
        <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                A
              </span>
              <span className="font-bold text-xs text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                {metadataA?.title || 'Conteúdo A'}
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getIntentBadgeColor(
                contentA.type
              )}`}
            >
              {contentA.type}
            </span>
          </div>

          <div className="space-y-2.5">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                Estágio do Funil do Usuário:
              </span>
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${getFunnelBadgeColor(
                  contentA.funnelStage
                )}`}
              >
                {contentA.funnelStage}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                Diagnóstico de Intenção:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {contentA.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Content B Card */}
        <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                B
              </span>
              <span className="font-bold text-xs text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                {metadataB?.title || 'Conteúdo B'}
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getIntentBadgeColor(
                contentB.type
              )}`}
            >
              {contentB.type}
            </span>
          </div>

          <div className="space-y-2.5">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                Estágio do Funil do Usuário:
              </span>
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${getFunnelBadgeColor(
                  contentB.funnelStage
                )}`}
              >
                {contentB.funnelStage}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                Diagnóstico de Intenção:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {contentB.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
