import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Environments } from './components/Environments';
import { Assets } from './components/Assets';
import { Sensors } from './components/Sensors';
import { Monitoring } from './components/Monitoring';
import { History } from './components/History';
import { AssetDetail } from './components/AssetDetail';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const handleNavigate = (page: string, assetId?: string) => {
    setCurrentPage(page);
    if (assetId) {
      setSelectedAssetId(assetId);
    }
  };

  const handleBack = () => {
    setCurrentPage('assets');
    setSelectedAssetId(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'environments':
        return <Environments />;
      case 'assets':
        return <Assets onNavigate={handleNavigate} />;
      case 'sensors':
        return <Sensors />;
      case 'monitoring':
        return <Monitoring onNavigate={handleNavigate} />;
      case 'history':
        return <History onNavigate={handleNavigate} />;
      case 'asset-detail':
        return selectedAssetId ? (
          <AssetDetail assetId={selectedAssetId} onBack={handleBack} />
        ) : (
          <div>Patrimônio não encontrado</div>
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppProvider>
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </Layout>
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}
