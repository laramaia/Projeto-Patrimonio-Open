import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Activity, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonitoringProps {
  onNavigate: (page: string, assetId?: string) => void;
}

export const Monitoring: React.FC<MonitoringProps> = ({ onNavigate }) => {
  const { movementLogs, getAssetById, getEnvironmentById, getSensorById } = useApp();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

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

  const getStatusBorderStyle = (status: string) => {
    switch (status) {
      case 'valid':
        return '#22c55e'; // green-500
      case 'suspicious':
        return '#eab308'; // yellow-500
      case 'unknown':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-600">Válida</Badge>;
      case 'suspicious':
        return <Badge className="bg-yellow-600">Suspeita</Badge>;
      case 'unknown':
        return <Badge className="bg-red-600">Desconhecido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Sort movements by most recent first
  const sortedMovements = [...movementLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Get movements from last 24 hours
  const recentMovements = sortedMovements.filter(log => {
    const logTime = new Date(log.timestamp).getTime();
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return logTime > dayAgo;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Últimas 24h</p>
                <p className="text-slate-900 text-2xl mt-1">{recentMovements.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Movimentações Válidas</p>
                <p className="text-slate-900 text-2xl mt-1">
                  {recentMovements.filter(m => m.status === 'valid').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Alertas</p>
                <p className="text-slate-900 text-2xl mt-1">
                  {recentMovements.filter(m => m.status !== 'valid').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Movement Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Leituras Recentes</CardTitle>
              <p className="text-slate-500 text-sm mt-1">
                Última atualização: {format(lastUpdate, "HH:mm:ss", { locale: ptBR })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>Sensor</TableHead>
                  <TableHead>Movimentação</TableHead>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhuma movimentação registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedMovements.map((log, index) => {
                    const asset = getAssetById(log.assetId);
                    const sensor = getSensorById(log.sensorId);
                    const fromEnv = getEnvironmentById(log.fromEnvironmentId);
                    const toEnv = getEnvironmentById(log.toEnvironmentId);
                    const isRecent = index < 3;

                    return (
                      <TableRow
                        key={log.id}
                        className={`cursor-pointer hover:bg-slate-50 ${isRecent ? 'bg-blue-50' : ''}`}
                        style={{ borderLeft: `4px solid ${getStatusBorderStyle(log.status)}` }}
                        onClick={() => onNavigate('asset-detail', asset?.id)}
                      >
                        <TableCell>
                          <div>
                            <p className="text-slate-900">{asset?.name || 'Desconhecido'}</p>
                            <p className="text-slate-500 text-xs">{asset?.epc || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {sensor?.name || 'Sensor desconhecido'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-slate-100">
                              {fromEnv?.name || 'Desconhecido'}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {toEnv?.name || 'Desconhecido'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(log.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
