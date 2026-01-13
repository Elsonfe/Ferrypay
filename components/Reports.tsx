
import React, { useState } from 'react';
import { Project, Payment, WorkLog, MaterialRequest, PayrollRequest } from '../types';
import { Printer, FileBarChart, Ship, Calendar, DollarSign } from 'lucide-react';

interface ReportsProps {
  project: Project;
  payments: Payment[];
  logs: WorkLog[];
  materials: MaterialRequest[];
  payroll: PayrollRequest[];
}

const Reports: React.FC<ReportsProps> = ({ project, payments, logs, materials, payroll }) => {
  const [reportType, setReportType] = useState<'FINANCIAL' | 'OPERATIONAL' | 'FULL'>('FULL');

  const totalPaid = payments.filter(p => p.status === 'COMPLETED').reduce((acc, p) => acc + p.amount, 0);
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Relatórios Ferrypay</h2>
          <p className="text-slate-500 font-medium">Gere documentos oficiais para prestação de contas</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Printer className="w-5 h-5" /> Imprimir Documento
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 print:hidden">
        {[
          { id: 'FULL', label: 'Relatório Geral', icon: FileBarChart },
          { id: 'FINANCIAL', label: 'Financeiro', icon: DollarSign },
          { id: 'OPERATIONAL', label: 'Operacional', icon: Ship },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              reportType === tab.id 
                ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600' 
                : 'bg-white text-slate-500 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div id="printable-report" className="bg-white p-8 md:p-16 rounded-[40px] border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0">
        <div className="flex justify-between items-start border-b-4 border-indigo-900 pb-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-950 rounded-xl flex items-center justify-center text-white">
                <Ship className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black text-indigo-950 tracking-tighter uppercase">Ferrypay Report</h1>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Indústria Naval Amazônica • Documento Gerencial</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-slate-900 uppercase">{reportType === 'FULL' ? 'Relatório Executivo' : reportType === 'FINANCIAL' ? 'Extrato Financeiro' : 'Diário Operacional'}</p>
            <p className="text-slate-400 font-medium">{new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projeto</p>
            <p className="font-black text-slate-900">{project.title}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Início</p>
            <p className="font-black text-slate-900">{new Date(project.startDate).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contrato Total</p>
            <p className="font-black text-indigo-600">R$ {project.totalValue.toLocaleString('pt-BR')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Pago</p>
            <p className="font-black text-green-600">R$ {totalPaid.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="space-y-12">
          {(reportType === 'FULL' || reportType === 'FINANCIAL') && (
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" /> Fluxo de Pagamentos Realizados
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b-2 border-slate-200">
                    <tr>
                      <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                      <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                      <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.filter(p => p.status === 'COMPLETED').map(p => (
                      <tr key={p.id}>
                        <td className="py-4 text-sm font-bold text-slate-600">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                        <td className="py-4 text-sm font-black text-slate-900">{p.description}</td>
                        <td className="py-4 text-sm font-black text-slate-900">R$ {p.amount.toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-black">
                      <td colSpan={2} className="py-6 px-4 text-sm uppercase">Total Pago até a data</td>
                      <td className="py-6 px-4 text-indigo-700 text-xl">R$ {totalPaid.toLocaleString('pt-BR')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {(reportType === 'FULL' || reportType === 'OPERATIONAL') && (
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" /> Resumo Operacional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Registros de Campo</h4>
                  {logs.slice(0, 8).map(log => (
                    <div key={log.id} className="border-l-2 border-indigo-200 pl-4 py-2">
                      <p className="text-[10px] font-black text-slate-400">{new Date(log.date).toLocaleString('pt-BR')}</p>
                      <p className="text-sm font-medium text-slate-700 mt-1">{log.content}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Logística de Suprimentos</h4>
                  {materials.map(m => (
                    <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div>
                        <p className="text-sm font-black text-slate-900">{m.itemName}</p>
                        <p className="text-[10px] font-bold text-slate-400">Qtd: {m.quantity}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${m.status === 'RECEIVED' ? 'text-green-600' : 'text-amber-600'}`}>
                        {m.status === 'RECEIVED' ? 'Entregue' : 'Pendente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200 grid grid-cols-2 gap-20">
          <div className="text-center">
            <div className="h-px bg-slate-300 w-full mb-4" />
            <p className="text-xs font-black text-slate-900 uppercase">Assinatura Contratante</p>
          </div>
          <div className="text-center">
            <div className="h-px bg-slate-300 w-full mb-4" />
            <p className="text-xs font-black text-slate-900 uppercase">Assinatura Empreiteiro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
