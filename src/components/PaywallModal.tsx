import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  ExternalLink,
  MessageCircle,
  LogIn,
  UserPlus,
  Loader2,
} from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string | null;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  reason,
}) => {
  const {
    user,
    userProfile,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(
          err.message || 'Falha ao autenticar com a conta Google. Tente novamente.'
        );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, informe e-mail e senha.');
      return;
    }
    if (authMode === 'register' && password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setAuthLoading(true);
    setErrorMessage(null);

    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Este e-mail já está cadastrado. Faça login.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('E-mail em formato inválido.');
      } else {
        setErrorMessage(err.message || 'Erro ao processar autenticação.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // WhatsApp link formatted with user email
  const userIdentifier = user?.email || 'novo_usuario';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(
    `Olá! Gostaria de solicitar a liberação de acesso imediato à Calculadora de Canibalização Semântico SEO para o e-mail: ${userIdentifier}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Semântico SEO • Acesso Premium</span>
              </div>
              <h2 className="text-lg font-black text-slate-950 tracking-tight">
                Liberação da Ferramenta de Canibalização
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {reason ||
              'Acesse a calculadora completa com análise vetorial de cosseno de alta densidade e diagnóstico cognitivo de intenção de busca.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Case 1: Logged in, but status is 'pending' */}
          {user && userProfile?.status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900">
                <div className="flex items-center gap-2 font-bold text-xs mb-1 text-amber-800">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Acesso sob Análise (Aguardando Aprovação)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed mb-2">
                  Sua conta com o e-mail <strong className="font-semibold">{user.email}</strong> foi registrada com sucesso! Para garantir a qualidade e segurança da infraestrutura de IA, novos acessos passam por aprovação da nossa equipe.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-medium bg-amber-100/70 p-2 rounded-lg text-amber-900 border border-amber-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Sincronização em tempo real ativa: esta janela destravará automaticamente assim que for aprovado.</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-600 block">
                  Deseja liberar agora mesmo?
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Solicitar Liberação Imediata via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                <span>Conectado como: {user.email}</span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-slate-700 hover:text-slate-950 font-medium underline"
                >
                  Trocar de conta
                </button>
              </div>
            </div>
          )}

          {/* Case 2: Logged in, but status is 'blocked' or 'expired' */}
          {user && (userProfile?.status === 'blocked' || userProfile?.status === 'expired') && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900">
                <div className="flex items-center gap-2 font-bold text-xs mb-1 text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Acesso Suspenso ou Bloqueado</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  O acesso para o e-mail <strong>{user.email}</strong> foi suspenso ou sua assinatura expirou. Entre em contato com a equipe da Semântico para reativar seu plano.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com Suporte no WhatsApp</span>
              </a>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-slate-700 hover:text-slate-950 font-medium text-[11px] underline"
                >
                  Sair da conta
                </button>
              </div>
            </div>
          )}

          {/* Case 3: Logged out - Provide fast login / signup options */}
          {!user && (
            <div className="space-y-4">
              {/* 1-Click Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-xl shadow-2xs transition active:scale-[0.99] disabled:opacity-50 text-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Entrar em 1 clique com Conta Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] text-slate-400 uppercase tracking-wider font-medium shrink-0">
                  ou acesse por e-mail
                </span>
              </div>

              {/* Tab Switcher: Login vs Register */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Entrar na Conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    authMode === 'register'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Criar Nova Conta
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Seu Nome Completo:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Alexander Rodrigues"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-hidden transition"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    E-mail:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-hidden transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Senha:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-hidden transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-xs transition active:scale-[0.99] disabled:opacity-50 text-xs mt-2"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authMode === 'login' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Acessar Calculadora</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Cadastrar e Solicitar Acesso</span>
                    </>
                  )}
                </button>
              </form>

              {/* Informational Benefits */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>O que está incluído na aprovação:</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Auditorias ilimitadas de páginas e intenção de busca</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Recomendações técnicas de 301, Canonical e Topic Clusters</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500">
          Semântico SEO • Inteligência Artificial e Consultoria Semântica de Alta Performance
        </div>
      </div>
    </div>
  );
};
