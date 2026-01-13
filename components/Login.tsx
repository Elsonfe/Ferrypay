
import React, { useState } from 'react';
import { User } from '../types';
import { Ship, Lock, User as UserIcon, ArrowRight, ShieldCheck, HardHat } from 'lucide-react';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulando um delay de processamento para feedback visual
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin({ id: 'employer-1', name: 'Dr. João Naval', role: 'EMPLOYER', username: 'admin' });
      } else if (username === 'empreiteiro' && password === 'obra2024') {
        onLogin({ id: 'contractor-1', name: 'Mestre Carlos Estaleiro', role: 'CONTRACTOR', username: 'empreiteiro' });
      } else {
        setError('Credenciais inválidas. Verifique os dados de acesso.');
        setIsLoading(false);
      }
    }, 800);
  };

  const quickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    // Auto login opcional ou apenas preencher
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Elementos Decorativos de Fundo - Naval/Tech */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Linhas de Grade Estilo Planta Baixa */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
           <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 animate-pulse"></div>
             <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
               <Ship className="w-10 h-10 text-white" />
             </div>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter mb-1">Ferry<span className="text-indigo-500">pay</span></h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Naval Financial Management</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 md:p-10 rounded-[48px] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-700">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-indigo-300 uppercase tracking-widest ml-2">Identificação</label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <UserIcon strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl px-12 py-4 focus:bg-white/[0.08] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="Seu usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-indigo-300 uppercase tracking-widest ml-2">Assinatura Digital</label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock strokeWidth={2.5} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl px-12 py-4 focus:bg-white/[0.08] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-2xl text-center animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white py-5 rounded-[24px] font-black text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="relative z-10">Acessar Sistema</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] text-center">Atalhos de Acesso Rápido</p>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => quickLogin('admin', 'admin')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all group"
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-white uppercase">Contratante</p>
                    <p className="text-[9px] text-slate-500">admin / admin</p>
                  </div>
                </button>
                <button 
                  onClick={() => quickLogin('empreiteiro', 'obra2024')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group"
                >
                  <HardHat className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-white uppercase">Empreiteiro</p>
                    <p className="text-[9px] text-slate-500">empreiteiro / obra2024</p>
                  </div>
                </button>
             </div>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
           <Ship className="w-5 h-5 text-white" />
           <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
        </div>
        
        <p className="text-center text-slate-600 mt-6 text-[10px] font-bold uppercase tracking-widest">
          Sincronizado via Ferrypay &middot; 2024
        </p>
      </div>
    </div>
  );
};

export default Login;
