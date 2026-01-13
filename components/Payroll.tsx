
import React, { useState } from 'react';
import { PayrollRequest, User } from '../types';
import { Users, Plus, CheckCircle2, Trash2 } from 'lucide-react';

interface PayrollProps {
  user: User;
  requests: PayrollRequest[];
  onAddRequest: (r: PayrollRequest) => void;
  onUpdateStatus: (id: string, status: 'PENDING' | 'APPROVED' | 'PAID') => void;
  onDeleteRequest: (id: string) => void;
}

const Payroll: React.FC<PayrollProps> = ({ user, requests, onAddRequest, onUpdateStatus, onDeleteRequest }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [weekEnding, setWeekEnding] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekEnding || !amount || !details) return;

    const newRequest: PayrollRequest = {
      id: Date.now().toString(),
      weekEnding,
      amount: parseFloat(amount),
      details,
      status: 'PENDING'
    };

    onAddRequest(newRequest);
    setShowAdd(false);
    setAmount('');
    setDetails('');
    setWeekEnding('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Folha Semanal</h2>
        {user.role === 'CONTRACTOR' && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" /> Nova Solicitação
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Data Final da Semana</label>
              <input 
                type="date" 
                value={weekEnding}
                onChange={(e) => setWeekEnding(e.target.value)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Valor Total (R$)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="0,00"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Discriminação</label>
              <textarea 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all min-h-[100px]"
                placeholder="Ex: 4 Soldadores, 2 Ajudantes..."
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold flex-1 hover:bg-indigo-700 transition-all order-1 sm:order-none">Enviar para Aprovação</button>
            <button type="button" onClick={() => setShowAdd(false)} className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all order-2 sm:order-none">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium px-4">Nenhuma folha registrada.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="group bg-white p-5 md:p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-200 transition-all">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-widest border border-indigo-100">
                    Semana: {new Date(req.weekEnding).toLocaleDateString('pt-BR')}
                  </span>
                  {req.status === 'PAID' ? (
                    <span className="text-[10px] font-black text-green-700 bg-green-50 px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-widest border border-green-100"><CheckCircle2 className="w-3 h-3"/> Pago</span>
                  ) : req.status === 'APPROVED' ? (
                    <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-widest border border-blue-100">Aprovado</span>
                  ) : (
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-widest border border-amber-100">Pendente</span>
                  )}
                </div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">R$ {req.amount.toLocaleString('pt-BR')}</h4>
                <p className="text-slate-500 text-sm font-medium italic truncate max-w-full sm:max-w-[400px]">"{req.details}"</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                {user.role === 'EMPLOYER' && req.status === 'PENDING' && (
                  <button 
                    onClick={() => onUpdateStatus(req.id, 'APPROVED')}
                    className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
                  >
                    Aprovar
                  </button>
                )}
                {user.role === 'EMPLOYER' && req.status === 'APPROVED' && (
                  <button 
                    onClick={() => onUpdateStatus(req.id, 'PAID')}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-md shadow-green-100"
                  >
                    Pagar
                  </button>
                )}
                
                {/* Botão de Excluir: Disponível se não estiver PAGO */}
                {req.status !== 'PAID' && (
                  <button 
                    onClick={() => onDeleteRequest(req.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Excluir solicitação"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Payroll;
