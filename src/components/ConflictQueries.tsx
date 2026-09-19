import React from 'react';
import { CannibalizationAnalysisResult } from '../types';
import { Swords, Check, X, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface ConflictQueriesProps {
  conflictingQueries: CannibalizationAnalysisResult['conflictingQueries'];
  topicalComparison: CannibalizationAnalysisResult['topicalComparison'];
  conflictPoints: CannibalizationAnalysisResult['conflictPoints'];
}

export const ConflictQueries: React.FC<ConflictQueriesProps> = ({
  conflictingQueries,
  topicalComparison,
  conflictPoints,
}) => {
  const getImpactBadge = (impact: string) => {
    if (impact.includes('Alta')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (impact.includes('Moderada')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Conflicting Queries in SERP */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Termos e Palavras-Chave em Conflito no Google SERP
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Consultas onde o Google dividirá impressões e autoridade
          </span>
        </div>

        {conflictingQueries.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 text-center">
            Nenhuma consulta de alto atrito detectada no Google SERP.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Palavra-Chave / Termo de Busca</th>
                    <th className="py-2.5 px-3">Risco de Canibalização</th>
                    <th className="py-2.5 px-3">Motivo do Conflito</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {conflictingQueries.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        "{q.query}"
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${getImpactBadge(
                            q.impact
                          )}`}
                        >
                          {q.impact}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 leading-relaxed">
                        {q.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Topical & Entity Matrix */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Matriz de Entidades e Tópicos Semânticos
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Shared / Redundant */}
          <div className="bg-rose-50/40 border border-rose-200/70 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Entidades Sobrepostas (Redundantes)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {topicalComparison.sharedEntitiesAndTopics.length > 0 ? (
                topicalComparison.sharedEntitiesAndTopics.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold shrink-0">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">Sem redundâncias críticas</li>
              )}
            </ul>
          </div>

          {/* Unique to A */}
          <div className="bg-blue-50/40 border border-blue-200/70 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-2">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Exclusivo do Conteúdo A</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {topicalComparison.uniqueToA.length > 0 ? (
                topicalComparison.uniqueToA.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold shrink-0">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">Nenhum ângulo exclusivo relevante</li>
              )}
            </ul>
          </div>

          {/* Unique to B */}
          <div className="bg-indigo-50/40 border border-indigo-200/70 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-2">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              <span>Exclusivo do Conteúdo B</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {topicalComparison.uniqueToB.length > 0 ? (
                topicalComparison.uniqueToB.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">Nenhum ângulo exclusivo relevante</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Specific Conflict Points */}
      {conflictPoints && conflictPoints.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pontos Específicos de Atrito & Como Resolver</span>
          </h4>
          <div className="space-y-2.5">
            {conflictPoints.map((cp, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-lg p-3 text-xs"
              >
                <div className="font-semibold text-slate-900 mb-1">
                  Seção em atrito: <span className="text-blue-700">{cp.topic}</span>
                </div>
                <p className="text-slate-600 mb-1.5 leading-relaxed">
                  <strong className="text-slate-700">Problema:</strong> {cp.issue}
                </p>
                <p className="text-slate-800 bg-amber-50/60 border border-amber-200/60 p-2 rounded text-[11px] leading-relaxed">
                  <strong className="text-amber-800">Diferenciação Recomendada:</strong>{' '}
                  {cp.howToDifferentiate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
