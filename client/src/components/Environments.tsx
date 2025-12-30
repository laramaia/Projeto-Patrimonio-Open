import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

export const Environments: React.FC = () => {
  const { environments, assets, createEnvironment, updateEnvironment, deleteEnvironment, getAssetsByEnvironment } = useApp();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [environmentToDelete, setEnvironmentToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleOpenDialog = (environmentId?: string) => {
    if (environmentId) {
      const env = environments.find(e => e.id === environmentId);
      if (env) {
        setFormData({
          name: env.name,
          description: env.description || '',
        });
        setEditingEnvironment(environmentId);
      }
    } else {
      setFormData({ name: '', description: '' });
      setEditingEnvironment(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEnvironment(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome do ambiente é obrigatório');
      return;
    }

    if (editingEnvironment) {
      updateEnvironment(editingEnvironment, formData);
      toast.success('Ambiente atualizado com sucesso!');
    } else {
      createEnvironment(formData);
      toast.success('Ambiente criado com sucesso!');
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    const assetsInEnvironment = getAssetsByEnvironment(id);
    if (assetsInEnvironment.length > 0) {
      toast.error(`Não é possível excluir. Existem ${assetsInEnvironment.length} patrimônio(s) neste ambiente.`);
      return;
    }
    setEnvironmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (environmentToDelete) {
      deleteEnvironment(environmentToDelete);
      toast.success('Ambiente excluído com sucesso!');
      setEnvironmentToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">Gestão de Ambientes</CardTitle>
            <p className="text-slate-500 text-sm mt-1">
              Gerencie os locais físicos onde os patrimônios estão localizados
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            Novo Ambiente
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Ambiente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Patrimônios Presentes</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {environments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Nenhum ambiente cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                environments.map((env) => {
                  const assetsCount = getAssetsByEnvironment(env.id).length;
                  
                  return (
                    <TableRow key={env.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="text-slate-900">{env.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {env.description || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={assetsCount > 0 ? 'default' : 'secondary'}>
                          {assetsCount} {assetsCount === 1 ? 'item' : 'itens'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(env.id)}
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(env.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEnvironment ? 'Editar Ambiente' : 'Novo Ambiente'}
            </DialogTitle>
            <DialogDescription>
              {editingEnvironment ? 'Atualize as informações do ambiente.' : 'Preencha os dados para cadastrar um novo ambiente.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Ambiente *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Sala TI, Almoxarifado..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional do ambiente"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingEnvironment ? 'Atualizar' : 'Criar'}
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
              Tem certeza que deseja excluir este ambiente? Esta ação não pode ser desfeita.
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
