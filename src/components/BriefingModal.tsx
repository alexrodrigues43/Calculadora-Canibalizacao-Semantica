import React, { useState } from 'react';
import { CannibalizationAnalysisResult } from '../types';
import { generateBriefing, formatBriefingMarkdown } from '../utils/briefingGenerator';
import {
  X,
  FileText,
  Copy,
  Check,
  Sparkles,
  CheckSquare,
  Square,
  ArrowRight,
  GitMerge,
  Split,
  Layers,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CannibalizationAnalysisResult;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  const briefing = generateBriefing(result);
  const [copied, setCopied] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleCopy = () => {
    const markdown = formatBriefingMarkdown(briefing);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalSteps = briefing.actionChecklist.length;
  const completedCount = completedSteps.size;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-950 tracking-tight">
                  Briefing de Execução para Redator
                </h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Pronto para Pauta
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Diretrizes acionáveis de reescrita, unificação de H2s e consolidação de SEO
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Executive Strategy Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                  Estratégia Recomendada
                </span>
                <h4 className="text-sm font-bold text-white">{briefing.strategy}</h4>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block mb-0.5">Veredito Composto</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {result.overallScorePct}% Sobreposição
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-emerald-400 font-bold block mb-0.5">★ Artigo Master (Manter/Expandir):</span>
                <p className="text-slate-200 truncate font-medium">{briefing.masterTitle}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-amber-400 font-bold block mb-0.5">↳ Artigo Secundário (Ajustar/Redirecionar):</span>
                <p className="text-slate-200 truncate font-medium">{briefing.secondaryTitle}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs">
              <strong className="text-slate-300 block mb-1">Objetivo da Pauta para o Redator:</strong>
              <p className="text-slate-100 italic bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                "{briefing.coreObjective}"
              </p>
            </div>
          </div>

          {/* Checklist with Interactive Progress */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Checklist de Execução do Redator
                </h4>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">Progresso:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {completedCount}/{totalSteps} ({progressPct}%)
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="space-y-2">
              {briefing.actionChecklist.map((step, idx) => {
                const isDone = completedSteps.has(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 line-through opacity-80'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className="flex-1 leading-snug">
                      <strong>Passo {idx + 1}:</strong> {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sections to Move or Merge */}
          {briefing.sectionsToMoveOrMerge.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <GitMerge className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-bold text-slate-900">
                  Seções e Tópicos a Migrar ou Unificar
                </h4>
              </div>
              <p className="text-[11px] text-amber-900/80 mb-3">
                Transfira as informações destes subtópicos para o Artigo Master e remova redundâncias:
              </p>
              <ul className="space-y-1.5">
                {briefing.sectionsToMoveOrMerge.map((sec, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-white border border-amber-200/80 text-xs text-slate-800 flex items-start gap-2"
                  >
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{sec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Editorial Angle & Recommended H2s */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-900">
                Novo Ângulo Editorial & Estrutura de H2s Recomendada
              </h4>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-lg mb-3">
              <span className="text-[11px] font-bold text-blue-900 block mb-0.5">
                Ângulo Sugerido para o Conteúdo Secundário:
              </span>
              <p className="text-xs text-blue-950 leading-relaxed">
                {briefing.secondaryAngle}
              </p>
            </div>

            <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
              Estrutura de Subtítulos (H2) Pronta para o Redator:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {briefing.recommendedH2sSecondary.map((h2, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2 font-medium"
                >
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                    H2
                  </span>
                  <span className="truncate">{h2}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Link Directive */}
          {briefing.internalLinkDirective && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Diretriz de Linkagem Interna Obrigatória
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] mb-2">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Origem:</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {briefing.internalLinkDirective.source}
                  </span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Destino:</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {briefing.internalLinkDirective.target}
                  </span>
                </div>
                <div className="p-2 bg-purple-50 rounded border border-purple-200">
                  <span className="text-purple-600 block text-[10px] font-bold">Texto-Âncora Exato:</span>
                  <span className="font-bold text-purple-900 font-mono truncate block">
                    "{briefing.internalLinkDirective.anchorText}"
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 italic">
                <strong>Contexto do Parágrafo:</strong> {briefing.internalLinkDirective.context}
              </p>
            </div>
          )}

          {/* Quality Guidelines & SEO Tips */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block mb-1">
              Recomendações Finais de Redação SEO:
            </span>
            <ul className="space-y-1">
              {briefing.warningsAndTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 text-center sm:text-left">
            Exporta formato compatível com Notion, Google Docs e Trello.
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-2xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span className="text-emerald-950">Briefing Copiado (Markdown)!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950" />
                  <span>Copiar Briefing para Redator</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
