import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Package, MapPin, Radio, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  onNavigate: (page: string, assetId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { environments, assets, sensors, movementLogs, getAssetById, getEnvironmentById, getSensorById } = useApp();

  const recentMovements = movementLogs.slice(0, 8);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-500';
      case 'suspicious':
        return 'bg-yellow-500';
      case 'unknown':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Válida';
      case 'suspicious':
        return 'Suspeita';
      case 'unknown':
        return 'Desconhecido';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('assets')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Total de Patrimônios</CardTitle>
            <Package className="w-8 h-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{assets.length}</div>
            <p className="text-slate-500 text-xs mt-1">Ativos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('environments')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Total de Ambientes</CardTitle>
            <MapPin className="w-8 h-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{environments.length}</div>
            <p className="text-slate-500 text-xs mt-1">Locais cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('sensors')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Total de Sensores</CardTitle>
            <Radio className="w-8 h-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{sensors.length}</div>
            <p className="text-slate-500 text-xs mt-1">
              {sensors.filter(s => s.isActive).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('history')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Movimentações Hoje</CardTitle>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">
              {movementLogs.filter(log => {
                const today = new Date();
                const logDate = new Date(log.timestamp);
                return logDate.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-slate-500 text-xs mt-1">Últimas 24 horas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Últimas Movimentações</CardTitle>
          <p className="text-slate-500 text-sm">
            Itens movimentados recentemente através dos sensores RFID
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMovements.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nenhuma movimentação registrada
              </div>
            ) : (
              recentMovements.map((log) => {
                const asset = getAssetById(log.assetId);
                const sensor = getSensorById(log.sensorId);
                const fromEnv = getEnvironmentById(log.fromEnvironmentId);
                const toEnv = getEnvironmentById(log.toEnvironmentId);

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => onNavigate('asset-detail', asset?.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-3 h-3 rounded ${getStatusColor(log.status)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-slate-900">
                            {asset?.name || 'Desconhecido'}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {asset?.epc}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-slate-600 text-sm">
                          <span>{fromEnv?.name}</span>
                          <ArrowRight className="w-4 h-4" />
                          <span>{toEnv?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-slate-500 text-xs">{sensor?.name}</p>
                      <p className="text-slate-400 text-xs">
                        {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                      <Badge
                        variant={log.status === 'valid' ? 'default' : log.status === 'suspicious' ? 'secondary' : 'destructive'}
                        className="mt-1"
                      >
                        {getStatusLabel(log.status)}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
