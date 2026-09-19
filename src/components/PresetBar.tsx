import React from 'react';
import { PRESET_SCENARIOS } from '../data/presets';
import { PresetScenario, RiskLevel } from '../types';
import { Sparkles, AlertTriangle, AlertCircle, Link2, CheckCircle2 } from 'lucide-react';

interface PresetBarProps {
  onSelectPreset: (preset: PresetScenario) => void;
  activePresetId: string | null;
}

const getRiskBadge = (risk: RiskLevel) => {
  switch (risk) {
    case 'CRITICAL':
      return {
        label: 'Crítico (≥85%)',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: AlertCircle,
      };
    case 'HIGH':
      return {
        label: 'Alto (60-84%)',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: AlertTriangle,
      };
    case 'MODERATE':
      return {
        label: 'Cluster (30-59%)',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: Link2,
      };
    case 'LOW':
      return {
        label: 'Distinto (<30%)',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
      };
  }
};

export const PresetBar: React.FC<PresetBarProps> = ({ onSelectPreset, activePresetId }) => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Casos Práticos Prontos para Teste (1 Clique):</span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Carrega pares de conteúdo com diferentes padrões de canibalização SEO
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {PRESET_SCENARIOS.map((preset) => {
          const badge = getRiskBadge(preset.expectedRisk);
          const Icon = badge.icon;
          const isActive = activePresetId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-slate-900 truncate" title={preset.name}>
                    {preset.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-auto">
                <span className="text-[10px] text-slate-400">{preset.category}</span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${badge.color}`}
                >
                  <Icon className="w-2.5 h-2.5" />
                  {badge.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
