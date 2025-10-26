import React, { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Radio, 
  Activity, 
  History,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assets', label: 'Patrimônios', icon: Package },
  { id: 'environments', label: 'Ambientes', icon: MapPin },
  { id: 'sensors', label: 'Sensores RFID', icon: Radio },
  { id: 'monitoring', label: 'Monitoramento', icon: Activity },
  { id: 'history', label: 'Histórico', icon: History },
];

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1>Sistema de Gerenciamento</h1>
              <p className="text-slate-400 text-xs">Sistema de Controle</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h2 className="text-slate-900">
                  {menuItems.find(item => item.id === currentPage)?.label}
                </h2>
                <p className="text-slate-500 text-sm">
                  Sistema de Gestão e Rastreamento de Patrimônio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-slate-900 text-sm">Operador</p>
                <p className="text-slate-500 text-xs">Sistema de Gerenciamento</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white">OP</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
