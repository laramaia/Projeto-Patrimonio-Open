import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileDown, ArrowRight, Filter } from 'lucide-react';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface HistoryProps {
  onNavigate: (page: string, assetId?: string) => void;
}

export const History: React.FC<HistoryProps> = ({ onNavigate }) => {
  const { movementLogs, assets, environments, sensors, getAssetById, getEnvironmentById } = useApp();
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    assetId: 'all',
    environmentId: 'all',
    sensorId: 'all',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      assetId: 'all',
      environmentId: 'all',
      sensorId: 'all',
    });
  };

  const handleExport = () => {
    // Create HTML content for PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Movimentações - Sistema de Gerenciamento</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1e40af;
            margin: 0;
            font-size: 24px;
          }
          .header p {
            color: #64748b;
            margin: 5px 0 0 0;
            font-size: 14px;
          }
          .info {
            margin-bottom: 20px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
          }
          .info-row {
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #475569;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
          }
          tr:hover {
            background-color: #f8fafc;
          }
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
          }
          .status-valid {
            background-color: #dcfce7;
            color: #166534;
          }
          .status-suspicious {
            background-color: #fef3c7;
            color: #854d0e;
          }
          .status-unknown {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
          .arrow {
            color: #94a3b8;
            margin: 0 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Movimentações</h1>
          <p>Sistema de Gerenciamento de Patrimônio</p>
        </div>

        <div class="info">
          <div class="info-row">
            <span class="info-label">Data de Geração:</span> ${format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
          </div>
          <div class="info-row">
            <span class="info-label">Total de Registros:</span> ${sortedLogs.length}
          </div>
          ${filters.startDate ? `<div class="info-row"><span class="info-label">Período:</span> ${format(new Date(filters.startDate), "dd/MM/yyyy", { locale: ptBR })} até ${filters.endDate ? format(new Date(filters.endDate), "dd/MM/yyyy", { locale: ptBR }) : 'Hoje'}</div>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Patrimônio</th>
              <th>EPC</th>
              <th>Movimentação</th>
              <th>Data e Hora</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    sortedLogs.forEach(log => {
      const asset = getAssetById(log.assetId);
      const fromEnv = getEnvironmentById(log.fromEnvironmentId);
      const toEnv = getEnvironmentById(log.toEnvironmentId);

      const statusClass = log.status === 'valid' ? 'status-valid' :
                         log.status === 'suspicious' ? 'status-suspicious' : 'status-unknown';
      const statusText = log.status === 'valid' ? 'Válida' :
                        log.status === 'suspicious' ? 'Suspeita' : 'Desconhecido';

      htmlContent += `
        <tr>
          <td>${asset?.name || 'Desconhecido'}</td>
          <td>${asset?.epc || 'N/A'}</td>
          <td>${fromEnv?.name || 'Desconhecido'}<span class="arrow">→</span>${toEnv?.name || 'Desconhecido'}</td>
          <td>${format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>

        <div class="footer">
          <p>Relatório gerado automaticamente pelo Sistema de Gerenciamento de Patrimônio</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
      };

      toast.success('Relatório gerado! Use a opção "Salvar como PDF" na janela de impressão.');
    } else {
      toast.error('Não foi possível abrir a janela de impressão. Verifique as configurações do navegador.');
    }
  };

  // Filter movement logs
  const filteredLogs = movementLogs.filter(log => {
    // Date filter
    if (filters.startDate) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(filters.startDate);
      if (logDate < startDate) return false;
    }
    if (filters.endDate) {
      const logDate = new Date(log.timestamp);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (logDate > endDate) return false;
    }

    // Asset filter
    if (filters.assetId !== 'all' && log.assetId !== filters.assetId) {
      return false;
    }

    // Environment filter (from or to)
    if (filters.environmentId !== 'all') {
      if (log.fromEnvironmentId !== filters.environmentId && 
          log.toEnvironmentId !== filters.environmentId) {
        return false;
      }
    }

    // Sensor filter
    if (filters.sensorId !== 'all' && log.sensorId !== filters.sensorId) {
      return false;
    }

    return true;
  });

  // Sort by most recent first
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <CardTitle className="text-slate-900">Filtros de Busca</CardTitle>
            </div>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-filter">Patrimônio</Label>
              <Select value={filters.assetId} onValueChange={(value: string) => handleFilterChange('assetId', value)}>
                <SelectTrigger id="asset-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {assets.map(asset => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment-filter">Ambiente</Label>
              <Select value={filters.environmentId} onValueChange={(value: string) => handleFilterChange('environmentId', value)}>
                <SelectTrigger id="environment-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {environments.map(env => (
                    <SelectItem key={env.id} value={env.id}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sensor-filter">Sensor</Label>
              <Select value={filters.sensorId} onValueChange={(value: string) => handleFilterChange('sensorId', value)}>
                <SelectTrigger id="sensor-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {sensors.map(sensor => (
                    <SelectItem key={sensor.id} value={sensor.id}>
                      {sensor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Histórico de Movimentações</CardTitle>
              <p className="text-slate-500 text-sm mt-1">
                {sortedLogs.length} registro(s) encontrado(s)
              </p>
            </div>
            <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 gap-2">
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>EPC</TableHead>
                  <TableHead>Movimentação</TableHead>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhum registro encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLogs.map((log) => {
                    const asset = getAssetById(log.assetId);
                    const fromEnv = getEnvironmentById(log.fromEnvironmentId);
                    const toEnv = getEnvironmentById(log.toEnvironmentId);

                    return (
                      <TableRow
                        key={log.id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => onNavigate('asset-detail', asset?.id)}
                      >
                        <TableCell className="text-slate-900">
                          {asset?.name || 'Desconhecido'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {asset?.epc || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 text-sm">
                              {fromEnv?.name || 'Desconhecido'}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <span className="text-blue-600">
                              {toEnv?.name || 'Desconhecido'}
                            </span>
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
