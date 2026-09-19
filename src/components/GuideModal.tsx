import React from 'react';
import { X, Sparkles, Cpu, Layers, HelpCircle, ArrowRight } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Como Funciona a Calculadora de Canibalização
              </h3>
              <p className="text-xs text-slate-500">
                Evolução do notebook Colab com BERT para a IA do Google Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          {/* Comparison table */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Comparativo: Colab Original vs. Versão Gemini Pro</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-slate-800 block mb-1">Colab Python Original:</strong>
                <ul className="space-y-1 text-slate-600">
                  <li>• BERT leve <code className="text-slate-700">all-MiniLM-L6-v2</code> (384 dimensões)</li>
                  <li>• Apenas distância matemática de cosseno pura</li>
                  <li>• Textos truncados em 5.000 caracteres</li>
                  <li>• Diagnóstico estático por faixas fixas</li>
                </ul>
              </div>
              <div className="bg-blue-50/70 p-2.5 rounded border border-blue-200">
                <strong className="text-blue-900 block mb-1">Versão Gemini Aprimorada:</strong>
                <ul className="space-y-1 text-blue-800">
                  <li>• Embeddings Gemini 2 (<code className="text-blue-900">gemini-embedding-2-preview</code>)</li>
                  <li>• Análise de Intenção Cognitiva com Gemini 3.8 Flash</li>
                  <li>• Mapeamento de termos e consultas SERP em disputa</li>
                  <li>• Matriz de links internos e blueprint de reescrita H2</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">
              Faixas Oficiais de Diagnóstico de Canibalização:
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50">
                <strong className="text-rose-800 block">
                  🚨 ≥ 85% — PERIGO: CANIBALIZAÇÃO CRÍTICA
                </strong>
                <span>
                  Ambos os conteúdos atendem à mesma intenção exata. O Google divide autoridade e alterna qual página rankear. Solução: Canonical Tag ou Redirecionamento 301 fundindo o conteúdo no artigo principal.
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50">
                <strong className="text-amber-800 block">
                  ⚠️ 60% a 84.9% — ALERTA: SOBREPOSIÇÃO FORTE
                </strong>
                <span>
                  Há muitas semelhanças e disputa pelas mesmas palavras-chave secundárias. Solução: Diferenciar claramente os ângulos editoriais (ex: guia prático vs. comparação técnica).
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50">
                <strong className="text-blue-800 block">
                  🔗 30% a 59.9% — OPORTUNIDADE: CONTEXTO RELACIONADO
                </strong>
                <span>
                  Falam do mesmo universo semântico, mas com intenções complementares. Solução: Linkagem interna contextual (Topic Clusters) para transferir autoridade mútua.
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
                <strong className="text-emerald-800 block">
                  ✅ &lt; 30% — DISTINTO: INTENÇÕES DIFERENTES
                </strong>
                <span>
                  Pouca relação semântica. Podem coexistir pacificamente sem risco de auto-competição orgânica.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors text-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
