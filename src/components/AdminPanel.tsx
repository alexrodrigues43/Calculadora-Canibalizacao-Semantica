import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, SUPER_ADMIN_EMAIL } from '../lib/firebase';
import { UserProfile, UserStatus, UserPlan } from '../types';
import {
  Users,
  UserCheck,
  Clock,
  Zap,
  Search,
  CheckCircle,
  Ban,
  Trash2,
  Edit3,
  X,
  Shield,
  Filter,
  Save,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [editingNotesUid, setEditingNotesUid] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const usersCol = collection(db, 'users');
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as UserProfile);
        });
        // Sort: pending first, then by lastLoginAt desc
        list.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return new Date(b.lastLoginAt || 0).getTime() - new Date(a.lastLoginAt || 0).getTime();
        });
        setUsers(list);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching users in admin:', err);
        showToast('Erro ao carregar lista de usuários.', 'error');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const pendingUsers = users.filter((u) => u.status === 'pending').length;
  const totalExecutions = users.reduce((acc, u) => acc + (u.usageCount || 0), 0);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Actions
  const handleUpdateStatus = async (uid: string, status: UserStatus, email: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { status });
      showToast(
        status === 'active'
          ? `Usuário ${email} aprovado e ativado com sucesso!`
          : `Status do usuário ${email} atualizado para ${status}.`
      );
    } catch (err: any) {
      console.error(err);
      showToast('Falha ao atualizar status.', 'error');
    }
  };

  const handleUpdatePlan = async (uid: string, plan: UserPlan, email: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { plan });
      showToast(`Plano de ${email} alterado para ${plan}.`);
    } catch (err: any) {
      console.error(err);
      showToast('Falha ao alterar plano.', 'error');
    }
  };

  const handleSaveNotes = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { notes: noteText });
      setEditingNotesUid(null);
      showToast('Anotação interna salva com sucesso!');
    } catch (err: any) {
      console.error(err);
      showToast('Erro ao salvar anotação.', 'error');
    }
  };

  const handleDeleteUser = async (uid: string, email: string) => {
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      showToast('O Super Admin principal não pode ser excluído.', 'error');
      return;
    }

    if (window.confirm(`Tem certeza que deseja excluir o registro de ${email}?`)) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        showToast(`Registro de ${email} removido do Firestore.`);
      } catch (err: any) {
        console.error(err);
        showToast('Erro ao excluir registro.', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Toast feedback */}
        {toastMessage && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all animate-in slide-in-from-top-4 flex items-center gap-2 ${
              toastType === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-950 tracking-tight">
                  Painel Administrativo de Assinaturas & Acessos
                </h2>
                <span className="bg-amber-100 text-amber-900 border border-amber-300/80 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  Semântico Admin
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gerenciamento de clientes, aprovação em tempo real e controle de planos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="p-5 pb-3 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border-b border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Total de Usuários</span>
              <span className="text-lg font-black text-slate-900 leading-none">{totalUsers}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Assinantes Ativos</span>
              <span className="text-lg font-black text-emerald-700 leading-none">{activeUsers}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Solicitações Pendentes</span>
              <span className="text-lg font-black text-amber-600 leading-none">{pendingUsers}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Execuções Acumuladas</span>
              <span className="text-lg font-black text-indigo-700 leading-none">{totalExecutions}</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-hidden transition"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 font-semibold rounded-lg transition whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({totalUsers})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'pending'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Pendentes ({pendingUsers})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 font-semibold rounded-lg transition whitespace-nowrap ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Ativos ({activeUsers})
            </button>
            <button
              onClick={() => setStatusFilter('blocked')}
              className={`px-3 py-1 font-semibold rounded-lg transition whitespace-nowrap ${
                statusFilter === 'blocked'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bloqueados
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Carregando dados dos assinantes em tempo real...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhum usuário encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Usuário</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Plano</th>
                      <th className="py-3 px-3 text-center">Execuções</th>
                      <th className="py-3 px-3">Anotações Internas</th>
                      <th className="py-3 px-3 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const isSuperAdmin =
                        u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                      return (
                        <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                          {/* User Info */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.displayName || 'Sem Nome'}</span>
                              {isSuperAdmin && (
                                <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                                  SUPER ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : u.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {u.status === 'active'
                                ? '● Ativo'
                                : u.status === 'pending'
                                ? '⏱ Pendente'
                                : '✕ Bloqueado'}
                            </span>
                          </td>

                          {/* Plan Selector */}
                          <td className="py-3 px-3">
                            <select
                              value={u.plan || 'trial'}
                              onChange={(e) =>
                                handleUpdatePlan(u.uid, e.target.value as UserPlan, u.email)
                              }
                              disabled={isSuperAdmin}
                              className="text-xs py-1 px-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-amber-400 outline-hidden font-medium disabled:bg-slate-100"
                            >
                              <option value="trial">Trial</option>
                              <option value="monthly">Mensal</option>
                              <option value="annual">Anual</option>
                              <option value="lifetime">Vitalício</option>
                            </select>
                          </td>

                          {/* Usage Count */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                              {u.usageCount || 0}
                            </span>
                          </td>

                          {/* Internal Notes */}
                          <td className="py-3 px-3 max-w-[200px]">
                            {editingNotesUid === u.uid ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  className="w-full text-xs px-2 py-1 border border-amber-400 rounded-md outline-hidden"
                                  placeholder="Notas..."
                                />
                                <button
                                  onClick={() => handleSaveNotes(u.uid)}
                                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                  title="Salvar"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingNotesUid(null)}
                                  className="p-1 text-slate-400 hover:text-slate-700"
                                  title="Cancelar"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingNotesUid(u.uid);
                                  setNoteText(u.notes || '');
                                }}
                                className="group flex items-center justify-between text-[11px] text-slate-600 cursor-pointer p-1 rounded hover:bg-slate-100 transition"
                                title="Clique para editar nota interna"
                              >
                                <span className="truncate">
                                  {u.notes || <span className="text-slate-400 italic">Adicionar nota...</span>}
                                </span>
                                <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0 ml-1" />
                              </div>
                            )}
                          </td>

                          {/* Quick Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {u.status !== 'active' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(u.uid, 'active', u.email)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition shadow-2xs"
                                  title="Aprovar e Liberar Acesso"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Aprovar</span>
                                </button>
                              )}

                              {u.status !== 'blocked' && !isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(u.uid, 'blocked', u.email)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 text-[11px] font-medium rounded-lg transition"
                                  title="Bloquear Acesso"
                                >
                                  <Ban className="w-3 h-3" />
                                  <span>Bloquear</span>
                                </button>
                              )}

                              {!isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.uid, u.email)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                                  title="Excluir Registro"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Sincronização em tempo real via Firestore listener. Alterações refletem instantaneamente no navegador do usuário.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition text-xs self-end sm:self-auto"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
