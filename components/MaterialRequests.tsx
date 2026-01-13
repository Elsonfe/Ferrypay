
import React, { useState } from 'react';
import { MaterialRequest, User } from '../types';
import { Package, Plus, CheckCircle2 } from 'lucide-react';

interface MaterialRequestsProps {
  user: User;
  requests: MaterialRequest[];
  onAddRequest: (r: MaterialRequest) => void;
  onUpdateStatus: (id: string, status: 'PENDING' | 'ORDERED' | 'RECEIVED') => void;
}

const MaterialRequests: React.FC<MaterialRequestsProps> = ({ user, requests, onAddRequest, onUpdateStatus }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !quantity) return;

    const newRequest: MaterialRequest = {
      id: Date.now().toString(),
      itemName,
      quantity,
      urgency,
      status: 'PENDING',
      requestDate: new Date().toISOString()
    };

    onAddRequest(newRequest);
    setShowAdd(false);
    setItemName('');
    setQuantity('');
  };

  const getUrgencyColor = (u: string) => {
    switch(u) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Solicitação de Materiais</h2>
        {user.role === 'CONTRACTOR' && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" /> Solicitar Suprimento
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-semibold text-slate-700">Material</label>
              <input 
                type="text" 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="Ex: Chapas 10mm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Quantidade</label>
              <input 
                type="text" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="Ex: 50 un"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Urgência</label>
              <select 
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold flex-1 hover:bg-indigo-700 transition-all order-1 sm:order-none">Enviar Pedido</button>
            <button type="button" onClick={() => setShowAdd(false)} className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all order-2 sm:order-none">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium px-4">Nenhuma solicitação pendente.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getUrgencyColor(req.urgency)}`}>
                    {req.urgency === 'HIGH' ? 'Crítico' : req.urgency === 'MEDIUM' ? 'Médio' : 'Baixo'}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold">{new Date(req.requestDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight truncate">{req.itemName}</h4>
                  <p className="text-indigo-600 font-black mt-1">Qtd: {req.quantity}</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${req.status === 'RECEIVED' ? 'bg-green-500' : req.status === 'ORDERED' ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                    {req.status === 'PENDING' ? 'Aguardando' : req.status === 'ORDERED' ? 'Pedido' : 'Entregue'}
                  </span>
                </div>

                {user.role === 'EMPLOYER' && req.status === 'PENDING' && (
                  <button 
                    onClick={() => onUpdateStatus(req.id, 'ORDERED')}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
                  >
                    Marcar como Pedido
                  </button>
                )}
                {user.role === 'CONTRACTOR' && req.status === 'ORDERED' && (
                  <button 
                    onClick={() => onUpdateStatus(req.id, 'RECEIVED')}
                    className="w-full bg-green-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md shadow-green-100"
                  >
                    Confirmar Recebimento
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

// Fixed: Added missing default export
export default MaterialRequests;
