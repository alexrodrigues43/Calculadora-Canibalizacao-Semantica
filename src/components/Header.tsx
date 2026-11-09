import React, { useState, useRef, useEffect } from 'react';
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
  FileSpreadsheet,
  LogIn,
  Zap,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  onOpenGuide: (tab?: 'problem' | 'benefits' | 'howItWorks') => void;
  onOpenAdmin: () => void;
  onNewAnalysis: () => void;
  onOpenGsc?: () => void;
  historyCount?: number;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenAdmin,
  onNewAnalysis,
  onOpenGsc,
  historyCount = 0,
  onOpenAuth,
}) => {
  const { user, userProfile, isAdmin, isActive, openPaywall, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = () => {
    if (isAdmin) {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
          Super Admin
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

            {/* Desktop Nav Links (Matching official suite navigation) */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-700" aria-label="Navegação Principal">
              <a
                href="https://semantico.com.br/contato.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-950 transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
              >
                Contato
              </a>
            </nav>
          </div>

          {/* Right Controls: Credit Wallet Badge + Penultimate: Criar Conta + Last: Entrar / User */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Central Credit Wallet Badge / Comprar Créditos */}
            <a
              href="https://cobrador.semantico.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className={`min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs cursor-pointer whitespace-nowrap shrink-0 ${
                !user || isAdmin
                  ? 'bg-amber-500/10 text-amber-950 border-amber-300 hover:bg-amber-500/20'
                  : (userProfile?.creditsBalance ?? 0) > 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 animate-pulse'
              }`}
              title={isAdmin ? 'Super Admin: Créditos Ilimitados' : 'Clique para gerenciar créditos e recargas no Cobrador Semântico'}
            >
              <span className="text-sm" aria-hidden="true">🪙</span>
              <span>
                {!user
                  ? 'Comprar Créditos'
                  : isAdmin
                    ? 'Créditos Ilimitados'
                    : `${userProfile?.creditsBalance ?? 0} créditos`}
              </span>
            </a>

            {/* PENULTIMATE ITEM: Criar Conta / Assinatura / Super Admin (Golden Button) */}
            <button
              type="button"
              onClick={() => {
                if (isAdmin) {
                  onOpenAdmin();
                } else if (!user) {
                  onOpenAuth ? onOpenAuth('register') : openPaywall();
                } else {
                  openPaywall('Gerencie sua assinatura ou adquira recargas de créditos para a Suíte Semântico.');
                }
              }}
              className="px-4 py-1.5 rounded-full bg-[#f5be38] hover:bg-[#eab308] text-slate-950 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98 flex items-center gap-1.5"
              title={isAdmin ? 'Acessar Painel Super Admin' : user ? 'Gerenciar Assinatura e Créditos' : 'Criar Nova Conta'}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{isAdmin ? 'Super Admin' : user ? 'Assinatura' : 'Criar Conta'}</span>
            </button>

            {/* LAST ITEM: User Session Dropdown (Logged in) OR Entrar Button (Logged out) */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="" 
                      className="w-4 h-4 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#1a5d38]" />
                  )}
                  <span className="max-w-[85px] truncate text-[11px] font-bold">
                    {isAdmin ? 'Admin' : (displayName.split(' ')[0])}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        {getStatusBadge()}
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {userProfile?.plan || 'trial'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate mt-1">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-500 font-semibold">Saldo de Créditos:</span>
                        <span className="font-bold text-amber-800">
                          {isAdmin ? 'Ilimitado' : `${userProfile?.creditsBalance ?? 0} créditos`}
                        </span>
                      </div>
                    </div>

                    {!isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openPaywall('Recarregue ou assine para continuar utilizando a ferramenta.');
                        }}
                        className="w-full px-3.5 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-xs font-semibold text-amber-900 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Recarregar / Assinar</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#f5be38]" />
                        <span>Painel Administrativo</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenGuide();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>Como Funciona o Diagnóstico</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-xs font-semibold border-t border-slate-100 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Encerrar Sessão</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth ? onOpenAuth('login') : openPaywall()}
                className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Entrar</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Sub-navigation Bar (Matching design system: O Problema, Calculadora Semântica, Benefícios, Como Funciona | Histórico, + Nova Análise) */}
      <div className="bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Sub Navigation Items */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-slate-600">
            <button
              onClick={() => onOpenGuide('problem')}
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
              onClick={() => onOpenGuide('benefits')}
              className="hover:text-slate-950 transition font-medium px-2 py-1 rounded"
            >
              Benefícios
            </button>

            <button
              onClick={() => onOpenGuide('howItWorks')}
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

            {onOpenGsc && (
              <button
                type="button"
                onClick={onOpenGsc}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-xs active:scale-[0.98]"
                title="Importar CSV do Google Search Console"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Importar GSC</span>
              </button>
            )}

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
