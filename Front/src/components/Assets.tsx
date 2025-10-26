import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Pencil, Trash2, Package, Search, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AssetsProps {
  onNavigate: (page: string, assetId?: string) => void;
}

export const Assets: React.FC<AssetsProps> = ({ onNavigate }) => {
  const { environments, assets, addAsset, updateAsset, deleteAsset, getEnvironmentById } = useApp();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnvironment, setFilterEnvironment] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    epc: '',
    name: '',
    description: '',
    currentEnvironmentId: '',
  });

  const handleOpenDialog = (assetId?: string) => {
    if (assetId) {
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        setFormData({
          epc: asset.epc,
          name: asset.name,
          description: asset.description || '',
          currentEnvironmentId: asset.currentEnvironmentId,
        });
        setEditingAsset(assetId);
      }
    } else {
      setFormData({ epc: '', name: '', description: '', currentEnvironmentId: '' });
      setEditingAsset(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAsset(null);
    setFormData({ epc: '', name: '', description: '', currentEnvironmentId: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.epc.trim() || !formData.name.trim() || !formData.currentEnvironmentId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Check if EPC is unique
    const epcExists = assets.some(
      a => a.epc === formData.epc && a.id !== editingAsset
    );
    if (epcExists) {
      toast.error('Este EPC já está cadastrado');
      return;
    }

    if (editingAsset) {
      updateAsset(editingAsset, formData);
      toast.success('Patrimônio atualizado com sucesso!');
    } else {
      addAsset({ ...formData, lastReadAt: new Date() });
      toast.success('Patrimônio cadastrado com sucesso!');
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setAssetToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (assetToDelete) {
      deleteAsset(assetToDelete);
      toast.success('Patrimônio excluído com sucesso!');
      setAssetToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.epc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEnvironment = 
      filterEnvironment === 'all' || asset.currentEnvironmentId === filterEnvironment;
    
    return matchesSearch && matchesEnvironment;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Buscar por nome ou EPC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Label htmlFor="environment-filter">Filtrar por Ambiente</Label>
              <Select value={filterEnvironment} onValueChange={setFilterEnvironment}>
                <SelectTrigger id="environment-filter">
                  <SelectValue placeholder="Todos os ambientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os ambientes</SelectItem>
                  {environments.map(env => (
                    <SelectItem key={env.id} value={env.id}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Novo Patrimônio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Lista de Patrimônios</CardTitle>
          <p className="text-slate-500 text-sm">
            Total de {filteredAssets.length} patrimônio(s) encontrado(s)
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>EPC / Nome</TableHead>
                <TableHead>Ambiente Atual</TableHead>
                <TableHead>Última Leitura</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Nenhum patrimônio encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => {
                  const environment = getEnvironmentById(asset.currentEnvironmentId);
                  
                  return (
                    <TableRow key={asset.id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell onClick={() => onNavigate('asset-detail', asset.id)}>
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-slate-900">{asset.name}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {asset.epc}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => onNavigate('asset-detail', asset.id)}>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {environment?.name || 'Desconhecido'}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={() => onNavigate('asset-detail', asset.id)} className="text-slate-600">
                        {asset.lastReadAt
                          ? format(new Date(asset.lastReadAt), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : 'Nunca lido'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onNavigate('asset-detail', asset.id)}
                            title="Ver histórico"
                          >
                            <FileText className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(asset.id)}
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(asset.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAsset ? 'Editar Patrimônio' : 'Novo Patrimônio'}
            </DialogTitle>
            <DialogDescription>
              {editingAsset ? 'Atualize as informações do patrimônio.' : 'Preencha os dados para cadastrar um novo patrimônio com tag RFID.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="epc">EPC da Tag RFID *</Label>
                <Input
                  id="epc"
                  value={formData.epc}
                  onChange={(e) => setFormData({ ...formData, epc: e.target.value })}
                  placeholder="Ex: E200001A75020108"
                  required
                  disabled={!!editingAsset}
                />
                <p className="text-slate-500 text-xs">Identificador único da tag RFID</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Patrimônio *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Notebook Dell Latitude"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Ambiente Atual *</Label>
                <Select
                  value={formData.currentEnvironmentId}
                  onValueChange={(value) => setFormData({ ...formData, currentEnvironmentId: value })}
                >
                  <SelectTrigger id="environment">
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.map(env => (
                      <SelectItem key={env.id} value={env.id}>
                        {env.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingAsset ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este patrimônio? Todos os registros de movimentação associados serão mantidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
