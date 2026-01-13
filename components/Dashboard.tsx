
import React, { useState } from 'react';
import { Project, Payment, User, MaterialRequest, PayrollRequest, WorkLog } from '../types';
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  Edit3, 
  Save, 
  AlertCircle, 
  Package, 
  Users, 
  CheckCircle2, 
  Ship, 
  X,
  ArrowRight,
  ExternalLink,
  Zap
} from 'lucide-react';

interface DashboardProps {
  user: User;
  project: Project;
  payments: Payment[];
  workLogs: WorkLog[];
  materialRequests: MaterialRequest[];
  payrollRequests: PayrollRequest[];
  onUpdateProject: (p: Project) => void;
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  project, 
  payments, 
  materialRequests, 
  payrollRequests, 
  onUpdateProject,
  onNavigate
}) => {
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editValue, setEditValue] = useState(project.totalValue.toString());
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDate, setEditDate] = useState(project.startDate);

  const totalPaid = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + p.amount, 0);
  
  const balance = project.totalValue - totalPaid;
  const progressPercent = Math.min(Math.round((totalPaid / project.totalValue) * 100), 100);

  const pendingMaterials = materialRequests.filter(m => m.status === 'PENDING');
  const pendingPayroll = payrollRequests.filter(p => p.status === 'PENDING');
  const totalPendings = pendingMaterials.length + pendingPayroll.length;

  const handleSaveTotal = () => {
    onUpdateProject({ ...project, totalValue: parseFloat(editValue) });
    setIsEditingValue(false);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdateProject({ ...project, title: editTitle });
      setIsEditingTitle(false);
    }
  };

  const handleSaveDate = () => {
    onUpdateProject({ ...project, startDate: editDate });
    setIsEditingDate(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Live</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">OVERVIEW</h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            Controle financeiro e operacional Ferrypay
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 group hover:border-indigo-300 transition-all cursor-default">
            <Zap className="w-5 h-5 text-indigo-500 group-hover:fill-indigo-500 transition-all" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sincronização</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Estaleiro Ativo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-10 md:p-14 rounded-[48px] shadow-2xl relative overflow-hidden group/main border border-white/5">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20">
               <Ship className="w-4 h-4 text-indigo-300" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ferrypay Monitoring 2.0</span>
            </div>
            
            <div className="flex items-center gap-4 min-h-[64px]">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 w-full max-w-2xl">
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    className="bg-white/10 border border-white/30 text-white rounded-3xl px-6 py-3 w-full focus:outline-none text-3xl md:text-5xl font-black tracking-tight placeholder:text-white/20"
                    autoFocus
                  />
                  <button onClick={handleSaveTitle} className="p-4 bg-green-500 rounded-2xl hover:bg-green-400 transition-all shadow-xl hover:scale-105 active:scale-95">
                    <Save className="w-7 h-7 text-white"/>
                  </button>
                  <button onClick={() => { setIsEditingTitle(false); setEditTitle(project.title); }} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                    <X className="w-7 h-7 text-white"/>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight drop-shadow-sm">{project.title}</h2>
                  {user.role === 'EMPLOYER' && (
                    <button 
                      onClick={() => setIsEditingTitle(true)} 
                      className="p-3 bg-white/10 rounded-2xl transition-all hover:bg-white/20 border border-white/10 hover:scale-110 active:scale-95 flex items-center gap-2 group/editbtn"
                      title="Editar nome"
                    >
                      <Edit3 className="w-6 h-6 text-indigo-300"/>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {isEditingDate ? (
                <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/20">
                  <input 
                    type="date" 
                    value={editDate} 
                    onChange={(e) => setEditDate(e.target.value)} 
                    className="bg-transparent text-white px-4 py-2 outline-none font-bold text-sm"
                  />
                  <button onClick={handleSaveDate} className="p-2 bg-green-500 rounded-xl hover:bg-green-400 transition-all shadow-lg">
                    <Save className="w-4 h-4 text-white"/>
                  </button>
                  <button onClick={() => { setIsEditingDate(false); setEditDate(project.startDate); }} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                    <X className="w-4 h-4 text-white"/>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/10 shadow-inner group/datebox">
                    <Calendar className="w-5 h-5 text-indigo-300" />
                    <span className="text-indigo-100 font-bold text-sm uppercase tracking-wide">Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                    {user.role === 'EMPLOYER' && (
                      <button 
                        onClick={() => setIsEditingDate(true)}
                        className="ml-2 p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-all shadow-lg hover:scale-110"
                        title="Alterar data de início"
                      >
                        <Edit3 className="w-3.5 h-3.5"/>
                      </button>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                    <Ship className="w-5 h-5 text-indigo-400" />
                    <span className="text-indigo-200 font-bold text-sm uppercase tracking-wide">Status: Construção</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[40px] border border-white/20 min-w-[340px] shadow-2xl group/value relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <p className="text-indigo-300 text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center justify-between">
              Orçamento Previsto
              {user.role === 'EMPLOYER' && !isEditingValue && <span className="text-[8px] bg-indigo-500/40 px-2 py-0.5 rounded text-white font-black">ADMIN</span>}
            </p>
            <div className="flex items-center justify-between gap-4">
              {isEditingValue ? (
                <div className="flex items-center gap-2 w-full">
                  <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="bg-white/20 border border-white/30 text-white rounded-2xl px-5 py-3 w-full focus:outline-none text-2xl font-bold" />
                  <button onClick={handleSaveTotal} className="p-3 bg-green-500 rounded-xl hover:bg-green-400 transition-all shadow-lg"><Save className="w-6 h-6"/></button>
                  <button onClick={() => { setIsEditingValue(false); setEditValue(project.totalValue.toString()); }} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><X className="w-6 h-6 text-white"/></button>
                </div>
              ) : (
                <>
                  <p className="text-5xl font-black tracking-tighter">R$ {project.totalValue.toLocaleString('pt-BR')}</p>
                  {user.role === 'EMPLOYER' && (
                    <button 
                      onClick={() => setIsEditingValue(true)} 
                      className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10 hover:scale-105 shadow-lg"
                      title="Editar orçamento"
                    >
                      <Edit3 className="w-6 h-6 text-indigo-300"/>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <Ship className="absolute bottom-[-25%] left-[-10%] w-[500px] h-[500px] text-white/5 -rotate-12 pointer-events-none" />
      </div>

      {/* Atalhos de Gestão para o Contratante */}
      {user.role === 'EMPLOYER' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => onNavigate('materials')}
            className="group relative flex items-center justify-between p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all duration-500 text-left overflow-hidden hover:-translate-y-1"
          >
            <div className="relative z-10 flex items-center gap-8">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[28px] flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-indigo-100">
                <Package className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Suprimentos</h3>
                <p className="text-sm text-slate-500 font-medium">Fluxo de pedidos e entregas</p>
                {pendingMaterials.length > 0 && (
                  <span className="inline-flex mt-3 px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-200">
                    {pendingMaterials.length} Pendentes
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-3 transition-all duration-500" />
            <div className="absolute right-0 top-0 h-full w-2 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all"></div>
          </button>

          <button 
            onClick={() => onNavigate('payroll')}
            className="group relative flex items-center justify-between p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-500 text-left overflow-hidden hover:-translate-y-1"
          >
            <div className="relative z-10 flex items-center gap-8">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-emerald-100">
                <Users className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pagamentos</h3>
                <p className="text-sm text-slate-500 font-medium">Aprovação de folhas e verbas</p>
                {pendingPayroll.length > 0 && (
                  <span className="inline-flex mt-3 px-4 py-1.5 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-200">
                    {pendingPayroll.length} Aguardando
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-slate-200 group-hover:text-emerald-600 group-hover:translate-x-3 transition-all duration-500" />
            <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all"></div>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-8 group hover:border-indigo-300 transition-all hover:shadow-xl">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-all shadow-md"><TrendingUp className="w-10 h-10" /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Pago</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">R$ {totalPaid.toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-8 group hover:border-indigo-300 transition-all hover:shadow-xl">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-100 transition-all shadow-md"><Wallet className="w-10 h-10" /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Saldo</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">R$ {balance.toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-center group hover:border-indigo-300 transition-all hover:shadow-xl">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Progresso Financeiro</p>
            <div className="flex items-center gap-6">
              <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-800 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{progressPercent}%</span>
            </div>
        </div>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-200 shadow-2xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 relative z-10 gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl transition-all ${totalPendings > 0 ? 'bg-amber-500 shadow-amber-200/50 animate-pulse' : 'bg-emerald-500 shadow-emerald-200/50'}`}>
              {totalPendings > 0 ? <AlertCircle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Central de Atendimento</h3>
              <p className="text-base text-slate-500 font-medium mt-1">Sincronização de pendências em tempo real</p>
            </div>
          </div>
          {totalPendings > 0 && (
            <div className="flex flex-col items-end">
              <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-red-200">{totalPendings} Ações Necessárias</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-900 text-sm font-black uppercase tracking-[0.2em] mb-2 border-l-4 border-indigo-600 pl-4">
                <Package className="w-6 h-6 text-indigo-600" /> Suprimentos em Aberto
              </div>
              {user.role === 'EMPLOYER' && pendingMaterials.length > 0 && (
                <button onClick={() => onNavigate('materials')} className="text-indigo-600 hover:text-indigo-800 text-[11px] font-black uppercase flex items-center gap-1.5 group">
                  Detalhes <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
            {pendingMaterials.length > 0 ? (
              <div className="space-y-4">
                {pendingMaterials.map(m => (
                  <div key={m.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm hover:translate-x-2 transition-all border-l-4 border-l-indigo-500">
                    <div className="flex-1">
                      <p className="font-black text-slate-900 text-lg leading-tight">{m.itemName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Solicitado em: {new Date(m.requestDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-indigo-700 leading-none">{m.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm"><CheckCircle2 className="w-6 h-6" /></div>
                Fluxo de suprimentos otimizado.
              </div>
            )}
          </div>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-900 text-sm font-black uppercase tracking-[0.2em] mb-2 border-l-4 border-indigo-600 pl-4">
                <Users className="w-6 h-6 text-indigo-600" /> Pagamentos Pendentes
              </div>
              {user.role === 'EMPLOYER' && pendingPayroll.length > 0 && (
                <button onClick={() => onNavigate('payroll')} className="text-indigo-600 hover:text-indigo-800 text-[11px] font-black uppercase flex items-center gap-1.5 group">
                  Ver Tudo <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
            {pendingPayroll.length > 0 ? (
              <div className="space-y-4">
                {pendingPayroll.map(p => (
                  <div key={p.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm hover:translate-x-2 transition-all border-l-4 border-l-emerald-500">
                    <div className="flex-1">
                      <p className="font-black text-slate-900 text-lg leading-tight">Ref: {new Date(p.weekEnding).toLocaleDateString('pt-BR')}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate max-w-[200px]">{p.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-slate-900 leading-none">R$ {p.amount.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm"><CheckCircle2 className="w-6 h-6" /></div>
                Todas as solicitações atendidas.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[56px] border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all">
           <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
             Escopo do Projeto <div className="h-1.5 w-12 bg-indigo-100 rounded-full group-hover:w-24 group-hover:bg-indigo-600 transition-all duration-700"></div>
           </h3>
           <p className="text-slate-600 leading-relaxed font-medium text-lg">{project.description}</p>
        </div>
        <div className="bg-indigo-700 p-12 rounded-[56px] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden group">
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping"></div>
               <h3 className="text-3xl font-black uppercase tracking-tighter">Ferrypay 2.0</h3>
             </div>
             <p className="text-indigo-100 text-lg font-medium leading-relaxed opacity-90">Sincronização estratégica entre execução física em Manaus e gestão administrativa. Transparência operacional garantida via Ferrypay.</p>
           </div>
           <Ship className="absolute bottom-[-15%] right-[-10%] w-72 h-72 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
