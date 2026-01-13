
import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  LayoutDashboard, 
  CreditCard, 
  Package, 
  Camera, 
  Users, 
  LogOut,
  Menu,
  X,
  FileBarChart
} from 'lucide-react';
import { User, Project, Payment, MaterialRequest, WorkLog, PayrollRequest } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PaymentLedger from './components/PaymentLedger';
import WorkLogs from './components/WorkLogs';
import MaterialRequests from './components/MaterialRequests';
import Payroll from './components/Payroll';
import Reports from './components/Reports';

const STORAGE_KEY = 'ferrypay_data_v1';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  const [project, setProject] = useState<Project>({
    id: '1',
    title: 'Ferry Boat Manaus-Tabatinga II',
    totalValue: 1250000,
    contractorId: 'contractor-1',
    startDate: '2024-03-01',
    description: 'Construção de casco de balsa tipo ferry boat em aço naval.'
  });

  const [payments, setPayments] = useState<Payment[]>([]);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [payrollRequests, setPayrollRequests] = useState<PayrollRequest[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPayments(parsed.payments || []);
      setMaterialRequests(parsed.materialRequests || []);
      setWorkLogs(parsed.workLogs || []);
      setPayrollRequests(parsed.payrollRequests || []);
      if (parsed.project) setProject(parsed.project);
    }
  }, []);

  useEffect(() => {
    const data = { payments, materialRequests, workLogs, payrollRequests, project };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [payments, materialRequests, workLogs, payrollRequests, project]);

  const handlePayrollStatusUpdate = (id: string, status: 'PENDING' | 'APPROVED' | 'PAID') => {
    const request = payrollRequests.find(r => r.id === id);
    
    if (status === 'PAID' && request) {
      const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        amount: request.amount,
        description: `Folha Semanal: ${request.details} (Ref: ${new Date(request.weekEnding).toLocaleDateString('pt-BR')})`,
        date: new Date().toISOString(),
        status: 'COMPLETED'
      };
      setPayments(prev => [newPayment, ...prev]);
    }

    setPayrollRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDeletePayrollRequest = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta solicitação de pagamento?')) {
      setPayrollRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  if (!user) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          user={user} 
          project={project} 
          payments={payments} 
          workLogs={workLogs}
          materialRequests={materialRequests}
          payrollRequests={payrollRequests}
          onUpdateProject={setProject}
          onNavigate={(tab) => setActiveTab(tab)}
        />;
      case 'payments':
        return <PaymentLedger 
          user={user} 
          payments={payments} 
          totalValue={project.totalValue}
          onAddPayment={(p) => setPayments([p, ...payments])}
          onUpdateStatus={(id, status) => setPayments(payments.map(p => p.id === id ? {...p, status} : p))}
        />;
      case 'logs':
        return <WorkLogs user={user} logs={workLogs} onAddLog={(l) => setWorkLogs([l, ...workLogs])} />;
      case 'materials':
        return <MaterialRequests 
          user={user} 
          requests={materialRequests} 
          onAddRequest={(r) => setMaterialRequests([r, ...materialRequests])}
          onUpdateStatus={(id, status) => setMaterialRequests(materialRequests.map(r => r.id === id ? {...r, status} : r))}
        />;
      case 'payroll':
        return <Payroll 
          user={user} 
          requests={payrollRequests} 
          onAddRequest={(r) => setPayrollRequests([r, ...payrollRequests])}
          onUpdateStatus={handlePayrollStatusUpdate}
          onDeleteRequest={handleDeletePayrollRequest}
        />;
      case 'reports':
        return <Reports project={project} payments={payments} logs={workLogs} materials={materialRequests} payroll={payrollRequests} />;
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Quadro Principal', icon: LayoutDashboard },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'logs', label: 'Diário de Obra', icon: Camera },
    { id: 'materials', label: 'Suprimentos', icon: Package },
    { id: 'payroll', label: 'Folha Semanal', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: FileBarChart },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarOpen ? 'w-72' : 'w-20 lg:w-20'} bg-indigo-950 text-white flex flex-col shadow-2xl`}>
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-400/30">
              <Ship className="w-8 h-8 text-indigo-400" />
            </div>
            {isSidebarOpen && <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">Ferrypay</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2"><X className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 mt-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 border border-indigo-500/50' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="w-6 h-6 shrink-0" />
              {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 text-indigo-200 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm print:hidden">
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 hover:bg-slate-100 rounded-xl lg:hidden text-slate-600 transition-colors"><Menu className="w-6 h-6" /></button>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase truncate max-w-[150px] md:max-w-none">{navItems.find(i => i.id === activeTab)?.label}</h2>
              <p className="hidden md:block text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">Gestão Inteligente de Balsas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded-md inline-block">{user.role === 'EMPLOYER' ? 'Contratante' : 'Empreiteiro'}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-sm md:text-lg shadow-lg shadow-indigo-200 border-2 border-white ring-1 ring-indigo-100">{user.name.charAt(0)}</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-10 print:p-0">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
