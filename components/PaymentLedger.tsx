
import React, { useState } from 'react';
import { Payment, User } from '../types';
import { Plus, CheckCircle2, Clock, DollarSign } from 'lucide-react';

interface PaymentLedgerProps {
  user: User;
  payments: Payment[];
  totalValue: number;
  onAddPayment: (p: Payment) => void;
  onUpdateStatus: (id: string, status: 'COMPLETED' | 'PENDING') => void;
}

const PaymentLedger: React.FC<PaymentLedgerProps> = ({ user, payments, totalValue, onAddPayment, onUpdateStatus }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return;
    
    const newPayment: Payment = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description: desc,
      date: new Date().toISOString(),
      status: 'PENDING'
    };
    
    onAddPayment(newPayment);
    setShowAdd(false);
    setAmount('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Controle de Pagamentos</h2>
        {user.role === 'EMPLOYER' && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Novo Pagamento
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Valor do Lançamento (R$)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Descrição / Motivo</label>
              <input 
                type="text" 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="Ex: Entrega do casco"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold flex-1 hover:bg-indigo-700 transition-all order-1 sm:order-none">Confirmar Lançamento</button>
            <button type="button" onClick={() => setShowAdd(false)} className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all order-2 sm:order-none">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <DollarSign className="w-10 h-10 opacity-20" />
                      <p>Nenhum pagamento registrado.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(p.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {p.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      R$ {p.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          <Clock className="w-3.5 h-3.5" /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {user.role === 'EMPLOYER' && p.status === 'PENDING' && (
                        <button 
                          onClick={() => onUpdateStatus(p.id, 'COMPLETED')}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Fixed: Added missing default export
export default PaymentLedger;
