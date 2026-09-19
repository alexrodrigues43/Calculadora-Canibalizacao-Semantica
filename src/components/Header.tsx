import React, { useState } from 'react';
import { SemanticoLogo } from './SemanticoLogo';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  Plus,
  History,
  HelpCircle,
  CheckCircle2,
  Lock,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenAdmin: () => void;
  onNewAnalysis: () => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenAdmin,
  onNewAnalysis,
  historyCount = 0,
}) => {
  const { user, userProfile, isAdmin, isActive, openPaywall, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getStatusBadge = () => {
    if (isAdmin) {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
          Admin
        </span>
      );
    }
    if (userProfile?.status === 'active') {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
          Ativo
        </span>
      );
    }
    if (userProfile?.status === 'pending') {
      return (
        <span className="bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
          Pendente
        </span>
      );
    }
    return null;
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Usuário';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-2xs">
      {/* Top Main Navigation Bar (Design System Semântico) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Semântico Logo */}
          <div className="flex items-center gap-8">
            <a href="https://semantico.com.br" target="_blank" rel="noreferrer" className="flex items-center">
              <SemanticoLogo size="md" />
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
              <a
                href="https://semantico.com.br/#servicos"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-950 transition"
              >
                Serviços
              </a>
              <a
                href="#ferramentas"
                className="text-slate-950 flex items-center gap-1.5 transition"
              >
                <span>Ferramentas</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </a>
              <a
                href="https://semantico.com.br/blog"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-950 transition"
              >
                Blog
              </a>
              <a
                href="https://semantico.com.br/podcast"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-950 transition"
              >
                Podcasts
              </a>
              <a
                href="https://semantico.com.br/contato"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-950 transition"
              >
                Contato
              </a>
            </nav>
          </div>

          {/* Right: Language / Admin Button / User Profile */}
          <div className="flex items-center gap-3">
            {/* Country / Language Selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
              <span className="text-sm">🇧🇷</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Admin Panel Button (Strictly visible for role: 'admin') */}
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-2xs transition active:scale-[0.98]"
                title="Acessar Gestão de Assinantes e Permissões"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Painel Admin</span>
              </button>
            )}

            {/* User Profile or Login Trigger */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200 transition text-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {initial}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {displayName}
                        </span>
                        {getStatusBadge()}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                        <span>Plano: <strong className="capitalize">{userProfile?.plan || 'Trial'}</strong></span>
                        <span>Usos: <strong>{userProfile?.usageCount || 0}</strong></span>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Painel Administrativo</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenGuide();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>Como Funciona o Diagnóstico</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openPaywall()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Entrar / Cadastrar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-navigation Bar (Matching image.png: O Problema, Calculadora Semântica, Benefícios, Como Funciona | Histórico, + Nova Análise) */}
      <div className="bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Sub Navigation Items */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-slate-600">
            <button
              onClick={onOpenGuide}
              className="hover:text-slate-950 transition font-medium px-2 py-1 rounded"
            >
              O Problema
            </button>

            {/* Active tool tab */}
            <div className="bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-950 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Calculadora de Canibalização</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>

            <button
              onClick={onOpenGuide}
              className="hover:text-slate-950 transition font-medium px-2 py-1 rounded"
            >
              Benefícios
            </button>

            <button
              onClick={onOpenGuide}
              className="hover:text-slate-950 transition font-medium px-2 py-1 rounded"
            >
              Como Funciona
            </button>

            <div className="h-4 w-px bg-slate-300 hidden sm:block mx-1"></div>

            <div className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <History className="w-3 h-3 text-amber-400" />
              <span>Histórico</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 rounded-full">
                {historyCount}
              </span>
            </div>
          </div>

          {/* Right Action: + Nova Análise & Semântico SEO badge */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <span className="hidden md:inline-block text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              Ferramenta por Semântico SEO
            </span>

            <button
              type="button"
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Análise</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
