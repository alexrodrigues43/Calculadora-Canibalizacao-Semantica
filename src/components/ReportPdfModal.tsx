import React from 'react';
import { CannibalizationAnalysisResult } from '../types';
import { X, Printer, Download, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ReportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CannibalizationAnalysisResult;
}

export const ReportPdfModal: React.FC<ReportPdfModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const titleA = result.metadataA?.title || 'Conteúdo A';
  const titleB = result.metadataB?.title || 'Conteúdo B';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">
              Relatório Executivo Diagramado (PDF / Impressão)
            </span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
              Layout A4 Otimizado
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-2xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100/50 print:p-0 print:bg-white print:overflow-visible">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 max-w-3xl mx-auto space-y-6 text-slate-900 font-sans print:shadow-none print:border-none print:p-0 print:max-w-none">
            {/* Report Letterhead */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    S
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-950">
                    Semântico
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    SEO Intelligence
                  </span>
                </div>
                <h1 className="text-lg font-bold text-slate-900 mt-2">
                  Laudo Técnico de Auditoria de Canibalização Semântica
                </h1>
                <p className="text-xs text-slate-500">
                  Diagnóstico Cognitivo de SERP & Proximidade Vetorial de Cosseno
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <span className="font-semibold text-slate-700 block">
                  Data de Emissão:
                </span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  REF-{Math.random().toString(36).substring(2, 9).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Compared Entities Banner */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Conteúdo A (Primário)
                </span>
                <p className="font-semibold text-slate-900 truncate">{titleA}</p>
                <span className="text-[11px] text-slate-500">
                  {result.metadataA?.wordCount ? `${result.metadataA.wordCount} palavras` : 'Conteúdo auditado'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Conteúdo B (Secundário)
                </span>
                <p className="font-semibold text-slate-900 truncate">{titleB}</p>
                <span className="text-[11px] text-slate-500">
                  {result.metadataB?.wordCount ? `${result.metadataB.wordCount} palavras` : 'Conteúdo auditado'}
                </span>
              </div>
            </div>

            {/* Score & Verdict Card */}
            <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Veredito Composto
                  </span>
                  <h2 className="text-base font-bold text-white">
                    {result.statusHeadline}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400">
                    {result.overallScorePct}%
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Grau de Disputa
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="bg-slate-900/80 p-2 rounded">
                  <span className="text-slate-400 block text-[10px]">Similaridade Vetorial (Gemini):</span>
                  <span className="font-bold text-slate-200">{result.vectorSimilarityPct}%</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded">
                  <span className="text-slate-400 block text-[10px]">Sobreposição de Intenção:</span>
                  <span className="font-bold text-slate-200">{result.intentOverlapPct}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {result.diagnosisMessage}
              </p>
            </div>

            {/* Search Intent Comparison Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Análise de Intenção de Busca (Search Intent)
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                  <span className="font-bold text-slate-900 block mb-1">
                    Conteúdo A: {result.intentAnalysis.contentA.type}
                  </span>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {result.intentAnalysis.contentA.funnelStage}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {result.intentAnalysis.contentA.explanation}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                  <span className="font-bold text-slate-900 block mb-1">
                    Conteúdo B: {result.intentAnalysis.contentB.type}
                  </span>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {result.intentAnalysis.contentB.funnelStage}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {result.intentAnalysis.contentB.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Conflicting Queries Table */}
            {result.conflictingQueries.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  2. Consultas em Conflito Direto na SERP do Google
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase">
                      <tr>
                        <th className="p-2.5 font-bold">Consulta Alvo</th>
                        <th className="p-2.5 font-bold">Impacto</th>
                        <th className="p-2.5 font-bold">Justificativa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {result.conflictingQueries.map((q, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-900">"{q.query}"</td>
                          <td className="p-2.5 font-medium text-amber-800">{q.impact}</td>
                          <td className="p-2.5 text-slate-600">{q.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recommended Action & Implementation Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Diretriz Técnica Recomendada
              </h3>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-950 font-bold text-sm">
                    {result.recommendedAction.strategyName}
                  </strong>
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                    Master Sugerido: {result.recommendedAction.suggestedMaster}
                  </span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {result.recommendedAction.actionSummary}
                </p>

                <div className="pt-2">
                  <span className="font-bold text-slate-900 text-xs block mb-1">
                    Checklist de Execução para Equipe de SEO / Redação:
                  </span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {result.recommendedAction.stepByStep.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-semibold text-amber-900">{i + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Document Signature */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span>
                Calculadora de Canibalização Semântica • Semântico SEO AI Engine
              </span>
              <span>
                Documento técnico para fins de alinhamento estratégico de SEO.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
