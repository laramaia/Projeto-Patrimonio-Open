import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Package, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface AssetDetailProps {
  assetId: string;
  onBack: () => void;
}

export const AssetDetail: React.FC<AssetDetailProps> = ({ assetId, onBack }) => {
  const { assets, movementLogs, getEnvironmentById, getSensorById, updateMovementLog } = useApp();

  const asset = assets.find(a => a.id === assetId);

  const handleStatusChange = (logId: string, newStatus: string) => {
    updateMovementLog(logId, { status: newStatus as 'valid' | 'suspicious' | 'unknown' });
    const statusLabel = newStatus === 'valid' ? 'Válida' : newStatus === 'suspicious' ? 'Suspeita' : 'Desconhecido';
    toast.success(`Status alterado para "${statusLabel}" com sucesso!`);
  };
  
  if (!asset) {
    return (
      <div className="space-y-6">
        <Card className="bg-white border-slate-200">
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">Patrimônio não encontrado</p>
            <Button onClick={onBack} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentEnvironment = getEnvironmentById(asset.currentEnvironmentId);
  
  // Get all movements for this asset
  const assetMovements = movementLogs
    .filter(log => log.assetId === assetId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      {/* Asset Information */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900">{asset.name}</CardTitle>
                <p className="text-slate-500 mt-1">{asset.description || 'Sem descrição'}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-sm">
                    EPC: {asset.epc}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Localização Atual</p>
                <p className="text-slate-900 mt-1">{currentEnvironment?.name || 'Desconhecido'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Última Leitura</p>
                <p className="text-slate-900 mt-1">
                  {asset.lastReadAt
                    ? format(new Date(asset.lastReadAt), "dd/MM/yyyy HH:mm", { locale: ptBR })
                    : 'Nunca lido'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Data de Cadastro</p>
                <p className="text-slate-900 mt-1">
                  {format(new Date(asset.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement Timeline */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Histórico de Movimentações</CardTitle>
          <p className="text-slate-500 text-sm">
            {assetMovements.length} movimentação(ões) registrada(s)
          </p>
        </CardHeader>
        <CardContent>
          {assetMovements.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Nenhuma movimentação registrada para este patrimônio
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
              
              <div className="space-y-6">
                {assetMovements.map((log, index) => {
                  const sensor = getSensorById(log.sensorId);
                  const fromEnv = getEnvironmentById(log.fromEnvironmentId);
                  const toEnv = getEnvironmentById(log.toEnvironmentId);
                  const isLatest = index === 0;

                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'valid':
                        return 'bg-green-500 border-green-200';
                      case 'suspicious':
                        return 'bg-yellow-500 border-yellow-200';
                      case 'unknown':
                        return 'bg-red-500 border-red-200';
                      default:
                        return 'bg-gray-500 border-gray-200';
                    }
                  };

                  return (
                    <div key={log.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className={`relative z-10 w-4 h-4 mt-2 rounded-full border-4 ${getStatusColor(log.status)} ${isLatest ? 'ring-4 ring-blue-200' : ''}`} />
                      
                      {/* Movement card */}
                      <div className={`flex-1 p-4 rounded-lg border-2 ${isLatest ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-slate-100">
                                {fromEnv?.name || 'Desconhecido'}
                              </Badge>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                              <Badge className="bg-blue-600">
                                {toEnv?.name || 'Desconhecido'}
                              </Badge>
                              {isLatest && (
                                <Badge className="bg-green-600 ml-2">Atual</Badge>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm">
                              Sensor: {sensor?.name || 'Desconhecido'}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {format(new Date(log.timestamp), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                            </p>
                            <div className="mt-3">
                              <label className="text-slate-600 text-xs mb-1 block">Alterar Status:</label>
                              <Select
                                value={log.status}
                                onValueChange={(value: string) => handleStatusChange(log.id, value)}
                              >
                                <SelectTrigger className="w-48 h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="valid">
                                    <span className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-green-500" />
                                      Válida
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="suspicious">
                                    <span className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                      Suspeita
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="unknown">
                                    <span className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-red-500" />
                                      Desconhecido
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Badge
                              variant={log.status === 'valid' ? 'default' : log.status === 'suspicious' ? 'secondary' : 'destructive'}
                              className={log.status === 'valid' ? 'bg-green-600' : log.status === 'suspicious' ? 'bg-yellow-600' : ''}
                            >
                              {log.status === 'valid' ? 'Válida' : log.status === 'suspicious' ? 'Suspeita' : 'Desconhecido'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movement Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-500 text-sm">Total de Movimentações</p>
              <p className="text-slate-900 text-3xl mt-2">{assetMovements.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-500 text-sm">Movimentações Válidas</p>
              <p className="text-green-600 text-3xl mt-2">
                {assetMovements.filter(m => m.status === 'valid').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-500 text-sm">Alertas</p>
              <p className="text-yellow-600 text-3xl mt-2">
                {assetMovements.filter(m => m.status !== 'valid').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
