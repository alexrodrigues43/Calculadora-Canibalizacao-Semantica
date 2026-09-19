import React, { useState } from 'react';
import {
  Globe,
  FileText,
  ArrowRightLeft,
  Search,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ExtractedUrlData } from '../types';

interface InputPanelProps {
  contentA: string;
  setContentA: (val: string) => void;
  contentB: string;
  setContentB: (val: string) => void;
  targetKeyword: string;
  setTargetKeyword: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onClear: () => void;
  isActive?: boolean;
  onTriggerPaywall?: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  contentA,
  setContentA,
  contentB,
  setContentB,
  targetKeyword,
  setTargetKeyword,
  onAnalyze,
  isLoading,
  onClear,
  isActive = false,
  onTriggerPaywall,
}) => {
  const [fetchingUrlA, setFetchingUrlA] = useState(false);
  const [fetchingUrlB, setFetchingUrlB] = useState(false);
  const [previewA, setPreviewA] = useState<ExtractedUrlData | null>(null);
  const [previewB, setPreviewB] = useState<ExtractedUrlData | null>(null);
  const [fetchErrorA, setFetchErrorA] = useState<string | null>(null);
  const [fetchErrorB, setFetchErrorB] = useState<string | null>(null);

  const isUrlA = contentA.trim().startsWith('http://') || contentA.trim().startsWith('https://');
  const isUrlB = contentB.trim().startsWith('http://') || contentB.trim().startsWith('https://');

  const handleFetchUrl = async (side: 'A' | 'B') => {
    if (!isActive && onTriggerPaywall) {
      onTriggerPaywall();
      return;
    }
    const url = side === 'A' ? contentA.trim() : contentB.trim();
    if (!url.startsWith('http')) return;

    if (side === 'A') {
      setFetchingUrlA(true);
      setFetchErrorA(null);
    } else {
      setFetchingUrlB(true);
      setFetchErrorB(null);
    }

    try {
      const res = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao buscar URL');
      }

      if (side === 'A') {
        setPreviewA(data);
      } else {
        setPreviewB(data);
      }
    } catch (err: any) {
      if (side === 'A') {
        setFetchErrorA(err.message || 'Erro ao extrair conteúdo da URL');
      } else {
        setFetchErrorB(err.message || 'Erro ao extrair conteúdo da URL');
      }
    } finally {
      if (side === 'A') setFetchingUrlA(false);
      else setFetchingUrlB(false);
    }
  };

  const handleSwap = () => {
    const tempContent = contentA;
    setContentA(contentB);
    setContentB(tempContent);

    const tempPrev = previewA;
    setPreviewA(previewB);
    setPreviewB(tempPrev);
  };

  const wordCountA = contentA.trim() ? contentA.trim().split(/\s+/).length : 0;
  const wordCountB = contentB.trim() ? contentB.trim().split(/\s+/).length : 0;
  const canAnalyze = contentA.trim().length >= 30 && contentB.trim().length >= 30 && !isLoading;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-8">
      {/* Target Keyword input & toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="flex-1 w-full md:max-w-md">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Palavra-Chave / Termo Alvo da Disputa (Opcional)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="Ex: fundos imobiliarios para iniciantes, tenis de corrida..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={handleSwap}
            title="Inverter Conteúdo A e B"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inverter A/B</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            title="Limpar campos"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Side-by-side Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Content A */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs">
                A
              </span>
              <label className="text-xs font-bold text-slate-800">
                Conteúdo A (Texto ou URL)
              </label>
            </div>
            <div className="flex items-center gap-2">
              {isUrlA && (
                <button
                  type="button"
                  onClick={() => handleFetchUrl('A')}
                  disabled={fetchingUrlA}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/70 px-2 py-0.5 rounded transition-colors"
                >
                  {fetchingUrlA ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Globe className="w-3 h-3" />
                  )}
                  <span>Inspecionar URL</span>
                </button>
              )}
              <span className="text-[11px] text-slate-400">
                {isUrlA ? 'Modo URL detectado' : `${wordCountA} palavras`}
              </span>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              value={contentA}
              onChange={(e) => {
                setContentA(e.target.value);
                if (previewA) setPreviewA(null);
                if (fetchErrorA) setFetchErrorA(null);
              }}
              placeholder="Cole o Conteúdo A completo ou insira uma URL (https://...)"
              rows={8}
              className="w-full p-3.5 text-xs text-slate-800 font-mono sm:font-sans bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y leading-relaxed"
            />
          </div>

          {/* URL inspection status */}
          {fetchErrorA && (
            <div className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{fetchErrorA}</span>
            </div>
          )}

          {previewA && (
            <div className="mt-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-900 truncate">
                  {previewA.title || 'Página Web'}
                </span>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {previewA.wordCount} palavras extraídas
                </span>
              </div>
              {previewA.metaDescription && (
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-1.5">
                  {previewA.metaDescription}
                </p>
              )}
              <div className="flex items-center gap-2 text-[11px] text-blue-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Conteúdo rastreado e pronto para cálculo vetorial</span>
              </div>
            </div>
          )}
        </div>

        {/* Content B */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs">
                B
              </span>
              <label className="text-xs font-bold text-slate-800">
                Conteúdo B (Texto ou URL)
              </label>
            </div>
            <div className="flex items-center gap-2">
              {isUrlB && (
                <button
                  type="button"
                  onClick={() => handleFetchUrl('B')}
                  disabled={fetchingUrlB}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 px-2 py-0.5 rounded transition-colors"
                >
                  {fetchingUrlB ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Globe className="w-3 h-3" />
                  )}
                  <span>Inspecionar URL</span>
                </button>
              )}
              <span className="text-[11px] text-slate-400">
                {isUrlB ? 'Modo URL detectado' : `${wordCountB} palavras`}
              </span>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              value={contentB}
              onChange={(e) => {
                setContentB(e.target.value);
                if (previewB) setPreviewB(null);
                if (fetchErrorB) setFetchErrorB(null);
              }}
              placeholder="Cole o Conteúdo B completo ou insira uma URL (https://...)"
              rows={8}
              className="w-full p-3.5 text-xs text-slate-800 font-mono sm:font-sans bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y leading-relaxed"
            />
          </div>

          {/* URL inspection status */}
          {fetchErrorB && (
            <div className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{fetchErrorB}</span>
            </div>
          )}

          {previewB && (
            <div className="mt-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-900 truncate">
                  {previewB.title || 'Página Web'}
                </span>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {previewB.wordCount} palavras extraídas
                </span>
              </div>
              {previewB.metaDescription && (
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-1.5">
                  {previewB.metaDescription}
                </p>
              )}
              <div className="flex items-center gap-2 text-[11px] text-indigo-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Conteúdo rastreado e pronto para cálculo vetorial</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Suporta texto corrido, artigos HTML ou URLs públicas diretas</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isActive && onTriggerPaywall) {
              onTriggerPaywall();
            } else {
              onAnalyze();
            }
          }}
          disabled={!canAnalyze && isActive}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 ${
            canAnalyze
              ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold shadow-amber-400/20 active:scale-[0.99] cursor-pointer'
              : !isActive
              ? 'bg-amber-400/90 hover:bg-amber-500 text-slate-950 font-bold cursor-pointer'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Calculando Vetores & Intenção Gemini...</span>
            </>
          ) : !isActive ? (
            <>
              <span>Calcular Distância Vetorial & Diagnóstico SEO</span>
            </>
          ) : (
            <>
              <span>Calcular Distância Vetorial & Diagnóstico SEO</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
