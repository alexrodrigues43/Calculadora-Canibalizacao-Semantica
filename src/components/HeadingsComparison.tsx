import React, { useState } from 'react';
import { CannibalizationAnalysisResult } from '../types';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  ListTree,
  Filter,
  ArrowRight,
  Sparkles,
  GitMerge,
  Split,
  FileText,
} from 'lucide-react';

interface HeadingsComparisonProps {
  headingsAnalysis?: CannibalizationAnalysisResult['headingsAnalysis'];
  metadataA?: CannibalizationAnalysisResult['metadataA'];
  metadataB?: CannibalizationAnalysisResult['metadataB'];
}

type FilterStatus = 'all' | 'overlap' | 'uniqueA' | 'uniqueB';

export const HeadingsComparison: React.FC<HeadingsComparisonProps> = ({
  headingsAnalysis,
  metadataA,
  metadataB,
}) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<'sideBySide' | 'topicList'>('sideBySide');

  const comparisonList = headingsAnalysis?.comparisonList || [];
  const headingsA = headingsAnalysis?.headingsA || metadataA?.h2 || [];
  const headingsB = headingsAnalysis?.headingsB || metadataB?.h2 || [];

  const overlapCount = comparisonList.filter((item) => item.status === 'overlap').length;
  const uniqueACount = comparisonList.filter((item) => item.status === 'uniqueA').length;
  const uniqueBCount = comparisonList.filter((item) => item.status === 'uniqueB').length;

  const filteredList = comparisonList.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <ListTree className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Análise Comparativa de Estrutura de Headings (H2)
            </h3>
            <p className="text-xs text-slate-500">
              Compare a arquitetura de seções dos conteúdos para identificar tópicos em disputa direta.
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'sideBySide'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lado a Lado
          </button>
          <button
            type="button"
            onClick={() => setViewMode('topicList')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'topicList'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diagnóstico por Tópico
          </button>
        </div>
      </div>

      {/* Metric badges banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <span className="text-[11px] font-medium text-slate-500 block">Total H2s em A</span>
          <span className="text-lg font-bold text-blue-700">{headingsA.length}</span>
          <span className="text-[10px] text-slate-400 block truncate">
            {metadataA?.title || 'Conteúdo A'}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <span className="text-[11px] font-medium text-slate-500 block">Total H2s em B</span>
          <span className="text-lg font-bold text-purple-700">{headingsB.length}</span>
          <span className="text-[10px] text-slate-400 block truncate">
            {metadataB?.title || 'Conteúdo B'}
          </span>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-rose-700">Sobreposições (H2)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <span className="text-lg font-bold text-rose-800">{overlapCount}</span>
          <span className="text-[10px] text-rose-600/90 block">Conflitos Diretos</span>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-700">Seções Únicas</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-lg font-bold text-emerald-800">
            {uniqueACount + uniqueBCount}
          </span>
          <span className="text-[10px] text-emerald-600/90 block">Diferenciais de Conteúdo</span>
        </div>
      </div>

      {/* Side by side columns view */}
      {viewMode === 'sideBySide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column Content A */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  A
                </span>
                <span className="font-bold text-xs text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                  {metadataA?.title || 'Conteúdo A'}
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {headingsA.length} headings
              </span>
            </div>

            {headingsA.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                Nenhum cabeçalho H2 explicitamente identificado no Conteúdo A.
              </p>
            ) : (
              <ul className="space-y-2">
                {headingsA.map((heading, idx) => {
                  // Check if this heading has overlap
                  const isOverlap = comparisonList.some(
                    (c) =>
                      c.status === 'overlap' &&
                      c.topicH2.toLowerCase().includes(heading.toLowerCase().slice(0, 15))
                  );

                  return (
                    <li
                      key={idx}
                      className={`text-xs p-2.5 rounded-lg border flex items-start gap-2.5 transition ${
                        isOverlap
                          ? 'bg-rose-50/60 border-rose-200 text-rose-950 font-medium'
                          : 'bg-slate-50/80 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                        H2 #{idx + 1}
                      </span>
                      <span className="flex-1 leading-snug">{heading}</span>
                      {isOverlap && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                          Conflito
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Column Content B */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  B
                </span>
                <span className="font-bold text-xs text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                  {metadataB?.title || 'Conteúdo B'}
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {headingsB.length} headings
              </span>
            </div>

            {headingsB.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                Nenhum cabeçalho H2 explicitamente identificado no Conteúdo B.
              </p>
            ) : (
              <ul className="space-y-2">
                {headingsB.map((heading, idx) => {
                  const isOverlap = comparisonList.some(
                    (c) =>
                      c.status === 'overlap' &&
                      c.topicH2.toLowerCase().includes(heading.toLowerCase().slice(0, 15))
                  );

                  return (
                    <li
                      key={idx}
                      className={`text-xs p-2.5 rounded-lg border flex items-start gap-2.5 transition ${
                        isOverlap
                          ? 'bg-rose-50/60 border-rose-200 text-rose-950 font-medium'
                          : 'bg-slate-50/80 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                        H2 #{idx + 1}
                      </span>
                      <span className="flex-1 leading-snug">{heading}</span>
                      {isOverlap && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                          Conflito
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Topic List / Diagnostic View */}
      {viewMode === 'topicList' && (
        <div className="space-y-4">
          {/* Quick status filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Filtrar por:
            </span>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({comparisonList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('overlap')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                filter === 'overlap'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              Conflitos Diretos ({overlapCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('uniqueA')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                filter === 'uniqueA'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              Exclusivos A ({uniqueACount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('uniqueB')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                filter === 'uniqueB'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Exclusivos B ({uniqueBCount})
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-3">
            {filteredList.map((item, index) => (
              <div
                key={index}
                className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.status === 'overlap'
                    ? 'bg-rose-50/50 border-rose-200'
                    : item.status === 'uniqueA'
                    ? 'bg-blue-50/40 border-blue-200'
                    : 'bg-emerald-50/40 border-emerald-200'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.status === 'overlap'
                          ? 'bg-rose-200/80 text-rose-900 border border-rose-300'
                          : item.status === 'uniqueA'
                          ? 'bg-blue-200/80 text-blue-900 border border-blue-300'
                          : 'bg-emerald-200/80 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {item.status === 'overlap'
                        ? '🚨 Conflito Direto'
                        : item.status === 'uniqueA'
                        ? '📘 Exclusivo A'
                        : '📗 Exclusivo B'}
                    </span>
                    <strong className="text-slate-900 text-xs font-semibold">
                      {item.topicH2}
                    </strong>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical SEO guidance note */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold block">
            Diretriz de Arquitetura de Informação para Redatores:
          </strong>
          <p className="text-amber-900/90 leading-relaxed">
            Seções marcadas como <strong>Conflito Direto</strong> dividem a relevância semântica e competem pela mesma intenção de busca.
            Em caso de fusão (301), unifique os dados no Artigo Master. Em caso de diferenciação de ângulo, renomeie os H2s do artigo secundário para resolver dúvidas operacionais específicas.
          </p>
        </div>
      </div>
    </div>
  );
};
