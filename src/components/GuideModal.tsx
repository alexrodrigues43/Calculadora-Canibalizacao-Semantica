import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  GitMerge,
  Split,
  FileText,
  ShieldCheck,
  Search,
  ArrowRight,
  Flame,
  BarChart3,
  BookOpen,
} from 'lucide-react';

export type GuideTab = 'problem' | 'benefits' | 'howItWorks';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: GuideTab;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'howItWorks',
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-950 tracking-tight">
                  Central de Conhecimento & Metodologia SEO
                </h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Semântico SEO
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Fundamentos estratégicos sobre canibalização, benefícios para seu time e o algoritmo
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

        {/* Tab Navigation Bar */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('problem')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition shrink-0 ${
              activeTab === 'problem'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-600" />
            <span>O Problema da Canibalização</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition shrink-0 ${
              activeTab === 'benefits'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Benefícios & Ganhos de ROI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('howItWorks')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition shrink-0 ${
              activeTab === 'howItWorks'
                ? 'border-amber-500 text-amber-900'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>Como Funciona o Algoritmo</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* TAB 1: O PROBLEMA */}
          {activeTab === 'problem' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Hero explanation card */}
              <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h4>O que é a Canibalização Semântica na Prática?</h4>
                </div>
                <p className="text-xs leading-relaxed text-rose-900">
                  A canibalização de palavras-chave e semântica ocorre quando <strong>duas ou mais páginas do mesmo domínio competem entre si pela mesma intenção de busca</strong> no Google.
                  Em vez de somar forças, suas próprias páginas se anulam mutuamente nos resultados de pesquisa.
                </p>
              </div>

              {/* The 3 Silent Symptoms */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Os 3 Sintomas Silenciosos que Destroem o Tráfego do seu Site:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <strong className="text-slate-900 block text-xs">
                      SERP Bouncing (Instabilidade)
                    </strong>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      O algoritmo do Google fica indeciso sobre qual página é a resposta canônica. Ele fica alternando qual URL exibir semana a semana, impedindo que qualquer uma alcance o Top 3.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <strong className="text-slate-900 block text-xs">
                      Diluição de PageRank & CTR
                    </strong>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Backlinks externos e cliques dos usuários são divididos entre duas páginas médias. Em vez de uma página ultra-forte com autoridade máxima, você fica com duas páginas fracas.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <strong className="text-slate-900 block text-xs">
                      Desperdício de Crawl Budget
                    </strong>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      O Googlebot gasta seu orçamento de rastreamento reprocessando parágrafos e entidades redundantes, deixando de descobrir e indexar novos conteúdos importantes do seu site.
                    </p>
                  </div>
                </div>
              </div>

              {/* Case study before / after comparison */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <span className="font-bold text-xs text-slate-900 block">
                  Exemplo Clássico de Canibalização:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200 space-y-1">
                    <span className="text-rose-700 font-bold block">❌ Cenário Canibalizado:</span>
                    <p className="text-slate-700">
                      • <strong>URL A:</strong> "Como investir em FIIs (2023)" — Posição #8 (80 cliques/mês)<br />
                      • <strong>URL B:</strong> "Guia Completo de FIIs (2024)" — Posição #13 (35 cliques/mês)<br />
                      <span className="text-rose-900 font-semibold block mt-1">Total: 115 cliques/mês em posições baixas da primeira/segunda página.</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1">
                    <span className="text-emerald-700 font-bold block">✅ Após Fusão Estratégica (301):</span>
                    <p className="text-slate-700">
                      • <strong>URL Master Consolidada:</strong> "Guia Definitivo de FIIs"<br />
                      • <strong>Redirecionamento 301 de B para A</strong> com herança de autoridade.<br />
                      <span className="text-emerald-900 font-semibold block mt-1">Resultado: Salto para Posição #2 com 650 cliques/mês (+465% de crescimento).</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BENEFÍCIOS */}
          {activeTab === 'benefits' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h4>O Retorno sobre o Investimento (ROI) da Descanibalização</h4>
                </div>
                <p className="text-xs leading-relaxed text-emerald-900">
                  Descanibalizar conteúdos existentes é a <strong>estratégia de SEO mais rápida para gerar crescimento de tráfego</strong>: você não precisa criar novos artigos do zero nem esperar meses por indexação. Você apenas reorganiza a autoridade que o seu domínio já possui.
                </p>
              </div>

              {/* Three user personas benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700 font-bold">
                      <BarChart3 className="w-4 h-4" />
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">
                      Para Analistas de SEO
                    </h5>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li>• <strong>Fim do Achismo:</strong> Cálculo matemático de similaridade vetorial com IA do Google.</li>
                    <li>• <strong>Simulação Segura:</strong> Avalie tráfego e backlinks antes de aplicar 301.</li>
                    <li>• <strong>Auditoria em Lote:</strong> Importe planilhas do Search Console em 1 clique.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700 font-bold">
                      <FileText className="w-4 h-4" />
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">
                      Para Redatores & Conteúdo
                    </h5>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li>• <strong>Briefing Executável:</strong> Pauta pronta com seções a migrar e novos H2s sugeridos.</li>
                    <li>• <strong>Checklist Interativo:</strong> Passos claros de reescrita sem redundâncias.</li>
                    <li>• <strong>Exportação Markdown:</strong> Copie direto para Notion, Docs ou Trello.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">
                      Para o Negócio & Clientes
                    </h5>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li>• <strong>Recuperação de Tráfego:</strong> Páginas estagnadas voltam a ranquear no Top 3.</li>
                    <li>• <strong>Relatório Executivo PDF:</strong> Laudo diagramado pronto para envio a diretorias e clientes.</li>
                    <li>• <strong>Eficiência de Crawl:</strong> O Google rastreia e indexa suas páginas prioritárias mais rápido.</li>
                  </ul>
                </div>
              </div>

              {/* Practical table of gains */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase">
                    <tr>
                      <th className="p-2.5 font-bold">Ação Realizada</th>
                      <th className="p-2.5 font-bold">Impacto Direto no Google</th>
                      <th className="p-2.5 font-bold">Tempo Médio de Resposta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-900">Fusão de Conteúdo + 301</td>
                      <td className="p-2.5 text-slate-600">Unificação de PageRank e fim da dispersão de CTR</td>
                      <td className="p-2.5 text-emerald-700 font-bold">2 a 4 semanas</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-900">Diferenciação de Ângulo H2</td>
                      <td className="p-2.5 text-slate-600">Ambas as URLs ranqueiam para termos complementares sem conflito</td>
                      <td className="p-2.5 text-emerald-700 font-bold">3 a 6 semanas</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-900">Topic Cluster & Links</td>
                      <td className="p-2.5 text-slate-600">Artigo pilar herda autoridade dos artigos satélites</td>
                      <td className="p-2.5 text-emerald-700 font-bold">1 a 3 semanas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COMO FUNCIONA O ALGORITMO */}
          {activeTab === 'howItWorks' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4>O Motor Híbrido Semântico: Matemática Vetorial + Inteligência Cognitiva</h4>
                </div>
                <p className="text-xs leading-relaxed text-amber-900">
                  Diferente de contadores de palavras-chave superficiais, a Calculadora de Canibalização utiliza uma arquitetura híbrida de três camadas projetada especificamente para o algoritmo moderno do Google.
                </p>
              </div>

              {/* Three technical layers */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-700 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Camada 1: Proximidade Vetorial de Cosseno (Gemini Embedding 2)
                    </span>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      768 Dimensões
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Os textos são transformados em vetores densos multidimensionais pelo modelo <code className="text-slate-800 font-mono">gemini-embedding-2-preview</code>. O algoritmo calcula a distância matemática de cosseno entre eles no espaço vetorial, identificando sinônimos, entidades e campos semânticos equivalentes mesmo quando usam palavras diferentes.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Camada 2: Diagnóstico Cognitivo de SERP (Gemini 3.8 Flash)
                    </span>
                    <span className="text-[10px] font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                      JSON Schema Estrito
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    O modelo de linguagem analisa a <strong>Intenção de Busca do Usuário (Search Intent)</strong>, identificando o estágio do funil (ToFu, MoFu, BoFu), mapeando as queries exatas que disputarão impressões na SERP e comparando os subtítulos H2 lado a lado.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Camada 3: Motor Heurístico de Contingência (TF-IDF & Cache SHA-256)
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      Alta Disponibilidade
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Garante respostas instantâneas em menos de 100ms via cache hash SHA-256 de 24h e possui um algoritmo TF-IDF matemático de contingência, assegurando 100% de disponibilidade mesmo sob instabilidades externas de conectividade.
                  </p>
                </div>
              </div>

              {/* The 4 official diagnostic bands */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs">
                  Faixas Oficiais de Diagnóstico & Diretriz de Resolução:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/60 space-y-1">
                    <strong className="text-rose-900 block font-bold">
                      🚨 ≥ 85% — CANIBALIZAÇÃO CRÍTICA
                    </strong>
                    <span className="text-slate-700 leading-relaxed block">
                      Intenção praticamente idêntica. Solução: <strong>Redirecionamento 301</strong> (fusão no artigo Master) ou <strong>Canonical Tag</strong>.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 space-y-1">
                    <strong className="text-amber-900 block font-bold">
                      ⚠️ 60% a 84.9% — SOBREPOSIÇÃO FORTE
                    </strong>
                    <span className="text-slate-700 leading-relaxed block">
                      Muitas semelhanças e disputa por queries secundárias. Solução: <strong>Diferenciação de Ângulo e H2s</strong>.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/60 space-y-1">
                    <strong className="text-blue-900 block font-bold">
                      🔗 30% a 59.9% — CONTEXTO RELACIONADO
                    </strong>
                    <span className="text-slate-700 leading-relaxed block">
                      Cobrem o mesmo universo, mas aspectos complementares. Solução: <strong>Topic Cluster com Linkagem Interna</strong>.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 space-y-1">
                    <strong className="text-emerald-900 block font-bold">
                      ✅ &lt; 30% — INTENÇÕES DISTINTAS
                    </strong>
                    <span className="text-slate-700 leading-relaxed block">
                      Pouca relação semântica. Podem coexistir pacificamente sem risco de auto-concorrência no Google.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Metodologia proprietária Semântico SEO baseada nas diretrizes de Search Intent do Google.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition text-xs shadow-2xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
