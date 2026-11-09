import React, { useState, useRef } from 'react';
import { GscConflictRow } from '../types';
import { parseGscCsv } from '../utils/gscParser';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface GscImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConflict: (urlA: string, urlB: string, query: string) => void;
}

export const GscImporterModal: React.FC<GscImporterModalProps> = ({
  isOpen,
  onClose,
  onSelectConflict,
}) => {
  if (!isOpen) return null;

  const [conflicts, setConflicts] = useState<GscConflictRow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const results = parseGscCsv(text);
        if (results.length === 0) {
          setError(
            'Nenhuma canibalização direta encontrada no arquivo. Nenhuma query teve 2 ou mais URLs disputando impressões no período.'
          );
        }
        setConflicts(results);
      } catch (err: any) {
        setError(err.message || 'Erro ao processar arquivo CSV do Search Console.');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadDemo = () => {
    const demoCsv = `Query,Page,Clicks,Impressions,CTR,Position
como investir em fundos imobiliarios,https://exemplo.com.br/blog/como-investir-em-fiis,240,4200,5.7%,4.2
como investir em fundos imobiliarios,https://exemplo.com.br/guia-definitivo-fiis,180,3900,4.6%,5.8
melhores tenis de corrida,https://exemplo.com.br/analises/melhores-tenis-corrida-rua,510,8900,5.7%,3.1
melhores tenis de corrida,https://exemplo.com.br/reviews/top-10-tenis-corrida-2024,340,6700,5.0%,4.9
curso de seo avancado,https://exemplo.com.br/treinamentos/curso-seo,90,1800,5.0%,6.2
curso de seo avancado,https://exemplo.com.br/blog/o-que-aprender-em-um-curso-de-seo,15,950,1.5%,11.4`;

    try {
      const results = parseGscCsv(demoCsv);
      setFileName('amostra_demonstracao_gsc.csv');
      setConflicts(results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredConflicts = conflicts.filter((c) =>
    c.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-950 tracking-tight">
                  Importador de Canibalização via Google Search Console
                </h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                  Automação GSC
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Identifique automaticamente queries disputadas por múltiplas páginas no seu domínio
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              {fileName ? `Arquivo Carregado: ${fileName}` : 'Arraste seu arquivo CSV exportado do Search Console'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Exporte do Google Search Console a aba <strong>Desempenho &gt; Páginas</strong> com consultas associadas (CSV nativo).
            </p>

            <div className="flex items-center justify-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition"
              >
                Selecionar Arquivo CSV
              </button>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition"
              >
                Carregar Amostra Demo
              </button>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Conflict list */}
          {conflicts.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    {conflicts.length} conflitos detectados no Search Console
                  </span>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por query..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredConflicts.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            c.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-900 border border-rose-200'
                              : c.severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}
                        >
                          {c.severity === 'CRITICAL'
                            ? '🚨 Canibalização Crítica'
                            : c.severity === 'HIGH'
                            ? '⚠️ Sobreposição Alta'
                            : 'ℹ️ Disputa Moderada'}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          "{c.query}"
                        </h5>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectConflict(c.urlA, c.urlB, c.query);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-2xs shrink-0 self-start sm:self-auto"
                      >
                        <span>Auditar na Calculadora</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Both competing URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-blue-700 block truncate">
                          URL A: {c.urlA}
                        </span>
                        <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                          <span>Cliques: <strong>{c.clicksA}</strong></span>
                          <span>Impressões: <strong>{c.impressionsA}</strong></span>
                          <span>Posição Média: <strong>{c.positionA}</strong></span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-purple-700 block truncate">
                          URL B: {c.urlB}
                        </span>
                        <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                          <span>Cliques: <strong>{c.clicksB}</strong></span>
                          <span>Impressões: <strong>{c.impressionsB}</strong></span>
                          <span>Posição Média: <strong>{c.positionB}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Processamento 100% no navegador. Nenhum dado do cliente é armazenado externamente.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
