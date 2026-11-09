import React, { useState } from 'react';
import {
  CannibalizationAnalysisResult,
  TrafficLevel,
  BacklinkProfile,
  IntentOverlapType,
  BusinessValue,
} from '../types';
import { simulate301Decision } from '../utils/decisionEngine';
import {
  X,
  Sliders,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  Split,
  FileCheck,
  TrendingUp,
  Link,
  Layers,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

interface DecisionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CannibalizationAnalysisResult;
}

export const DecisionSimulatorModal: React.FC<DecisionSimulatorModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  const [traffic, setTraffic] = useState<TrafficLevel>('A_DOMINANT');
  const [backlinks, setBacklinks] = useState<BacklinkProfile>('A_STRONGER');
  const [intentOverlap, setIntentOverlap] = useState<IntentOverlapType>(
    result.overallScorePct >= 85 ? 'IDENTICAL_DUPLICATE' : 'PILLAR_VS_SUBTOPIC'
  );
  const [business, setBusiness] = useState<BusinessValue>('EDITORIAL_ONLY');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const titleA = result.metadataA?.title || 'Conteúdo A';
  const titleB = result.metadataB?.title || 'Conteúdo B';

  const simulation = simulate301Decision({
    traffic,
    backlinks,
    intentOverlap,
    business,
    similarityScore: result.overallScorePct,
    urlOrTitleA: titleA,
    urlOrTitleB: titleB,
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'MODERATE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const handleCopy = () => {
    const md = `# 🛡️ Simulação de Decisão de Resolução 301 (Auditoria de Risco de Tráfego)
**Artigo A:** ${titleA}
**Artigo B:** ${titleB}
**Similaridade Semântica Calculada:** ${result.overallScorePct}%

## 1. Diagnóstico de Risco
- **Veredito:** ${simulation.decisionTitle}
- **Nível de Risco de Perda de Tráfego:** ${simulation.riskLevel} (${simulation.riskScore}%)
- **Parecer Técnico:** ${simulation.executiveRationale}
- **Impacto Previsto de Tráfego:** ${simulation.trafficImpactAnalysis}

## 2. Roadmap de Implementação
${simulation.actionRoadmap.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## 3. Checklist de Preservação de PageRank & Backlinks
${simulation.preservationChecklist.map((c) => `- [ ] ${c}`).join('\n')}

## 4. Plano de Rollback (Contingência)
${simulation.rollbackPlan}
`;

    navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-950 tracking-tight">
                  Simulador de Decisão de Risco 301
                </h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                  GSC & Backlinks
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Avalie o histórico de tráfego e autoridade para evitar queda acidental na SERP antes de redirecionar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Inputs Section */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Cenário Real do Domínio (Auditoria Pré-301)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question 1: Traffic */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Volume de Tráfego Orgânico (GSC / Analytics):
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTraffic('A_DOMINANT')}
                    className={`p-2 rounded-lg border text-left transition ${
                      traffic === 'A_DOMINANT'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">URL A domina</span>
                    <span className="text-[10px] opacity-90 block truncate">Quase todo o tráfego</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTraffic('B_DOMINANT')}
                    className={`p-2 rounded-lg border text-left transition ${
                      traffic === 'B_DOMINANT'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">URL B domina</span>
                    <span className="text-[10px] opacity-90 block truncate">Mais acessada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTraffic('BOTH_ACTIVE')}
                    className={`p-2 rounded-lg border text-left transition ${
                      traffic === 'BOTH_ACTIVE'
                        ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">Ambas têm tráfego</span>
                    <span className="text-[10px] opacity-90 block truncate">Para termos distintos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTraffic('NEITHER_SIGNIFICANT')}
                    className={`p-2 rounded-lg border text-left transition ${
                      traffic === 'NEITHER_SIGNIFICANT'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">Tráfego Baixo/Nulo</span>
                    <span className="text-[10px] opacity-90 block truncate">Artigos novos</span>
                  </button>
                </div>
              </div>

              {/* Question 2: Backlinks */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-purple-600" />
                  Perfil de Backlinks Externos (Autoridade de Domínio):
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBacklinks('A_STRONGER')}
                    className={`p-2 rounded-lg border text-left transition ${
                      backlinks === 'A_STRONGER'
                        ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">URL A tem mais links</span>
                    <span className="text-[10px] opacity-90 block truncate">Mais domínios ref.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBacklinks('B_STRONGER')}
                    className={`p-2 rounded-lg border text-left transition ${
                      backlinks === 'B_STRONGER'
                        ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">URL B tem mais links</span>
                    <span className="text-[10px] opacity-90 block truncate">Links mais fortes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBacklinks('BOTH_IMPORTANT')}
                    className={`p-2 rounded-lg border text-left transition ${
                      backlinks === 'BOTH_IMPORTANT'
                        ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">Ambas têm links bons</span>
                    <span className="text-[10px] opacity-90 block truncate">Links editoriais</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBacklinks('NEITHER_RELEVANT')}
                    className={`p-2 rounded-lg border text-left transition ${
                      backlinks === 'NEITHER_RELEVANT'
                        ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">Sem backlinks</span>
                    <span className="text-[10px] opacity-90 block truncate">Poucos ou zero</span>
                  </button>
                </div>
              </div>

              {/* Question 3: Intent Nature */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Relação de Intenção de Busca:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIntentOverlap('IDENTICAL_DUPLICATE')}
                    className={`p-2 rounded-lg border text-left transition ${
                      intentOverlap === 'IDENTICAL_DUPLICATE'
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">100% Idêntica</span>
                    <span className="text-[10px] opacity-90 block truncate">Duplicata real</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIntentOverlap('PILLAR_VS_SUBTOPIC')}
                    className={`p-2 rounded-lg border text-left transition ${
                      intentOverlap === 'PILLAR_VS_SUBTOPIC'
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">Pilar vs Subtópico</span>
                    <span className="text-[10px] opacity-90 block truncate">Geral + Específico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIntentOverlap('DIFFERENT_ANGLES')}
                    className={`p-2 rounded-lg border text-left transition ${
                      intentOverlap === 'DIFFERENT_ANGLES'
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">Ângulos Distintos</span>
                    <span className="text-[10px] opacity-90 block truncate">Iniciante vs Avançado</span>
                  </button>
                </div>
              </div>

              {/* Question 4: Business Value */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Impacto de Negócio / Conversão:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBusiness('EDITORIAL_ONLY')}
                    className={`p-2 rounded-lg border text-left transition ${
                      business === 'EDITORIAL_ONLY'
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">Apenas Editorial</span>
                    <span className="text-[10px] opacity-90 block truncate">Blog orgânico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBusiness('A_HIGH_CONVERT')}
                    className={`p-2 rounded-lg border text-left transition ${
                      business === 'A_HIGH_CONVERT'
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">URL A converte mais</span>
                    <span className="text-[10px] opacity-90 block truncate">Gera leads/vendas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBusiness('B_HIGH_CONVERT')}
                    className={`p-2 rounded-lg border text-left transition ${
                      business === 'B_HIGH_CONVERT'
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">URL B converte mais</span>
                    <span className="text-[10px] opacity-90 block truncate">Página transacional</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Output Banner */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                  Veredito Calculado pelo Motor de Decisão SEO
                </span>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{simulation.decisionTitle}</span>
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${getRiskBadge(
                    simulation.riskLevel
                  )}`}
                >
                  Risco de Perda de Tráfego: {simulation.riskLevel} ({simulation.riskScore}%)
                </span>
              </div>
            </div>

            {/* Risk Gauge Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Segurança de Execução</span>
                <span>Risco: {simulation.riskScore}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    simulation.riskScore >= 70
                      ? 'bg-rose-500'
                      : simulation.riskScore >= 45
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${simulation.riskScore}%` }}
                />
              </div>
            </div>

            {/* Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-blue-300 block">Justificativa Técnica:</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {simulation.executiveRationale}
                </p>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-amber-300 block">Impacto Previsto de Tráfego:</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {simulation.trafficImpactAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* Action Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Passo a Passo de Implementação Segura:
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {simulation.actionRoadmap.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                      #{idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Checklist de Preservação de PageRank & Backlinks:
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {simulation.preservationChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rollback Plan */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
            <strong className="text-slate-900 block mb-1">Plano de Contingência (Rollback):</strong>
            <p className="text-[11px] leading-relaxed text-slate-600">
              {simulation.rollbackPlan}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Exporta o parecer completo com riscos para a equipe de infra/SEO.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Parecer Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Diretriz de Decisão</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
