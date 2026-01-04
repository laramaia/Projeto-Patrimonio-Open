import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Pencil, Trash2, Radio, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

export const Sensors: React.FC = () => {
  const { environments, sensors, createSensor, updateSensor, deleteSensor, getEnvironmentById } = useApp();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    exitEnvironmentId: '',
    entryEnvironmentId: '',
  });

  const handleOpenDialog = (sensorId?: string) => {
    if (sensorId) {
      const sensor = sensors.find(s => s.id === sensorId);
      if (sensor) {
        setFormData({
          name: sensor.name,
          exitEnvironmentId: sensor.exit_to_ambiente,
          entryEnvironmentId: sensor.entry_to_ambiente,
        });
        setEditingSensor(sensorId);
      }
    } else {
      setFormData({ name: '', exitEnvironmentId: '', entryEnvironmentId: '' });
      setEditingSensor(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSensor(null);
    setFormData({ name: '', exitEnvironmentId: '', entryEnvironmentId: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.exitEnvironmentId || !formData.entryEnvironmentId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.exitEnvironmentId === formData.entryEnvironmentId) {
      toast.error('Os ambientes de saída e entrada devem ser diferentes');
      return;
    }

    const sensorData = {
      name: formData.name,
      exit_to_ambiente: formData.exitEnvironmentId,
      entry_to_ambiente: formData.entryEnvironmentId,
    };

    if (editingSensor) {
      updateSensor(editingSensor, sensorData);
      toast.success('Sensor atualizado com sucesso!');
    } else {
      createSensor(sensorData);
      toast.success('Sensor cadastrado com sucesso!');
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setSensorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sensorToDelete) {
      deleteSensor(sensorToDelete);
      toast.success('Sensor excluído com sucesso!');
      setSensorToDelete(null);
    }
    setDeleteDialogOpen(false);
  };


  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">Gestão de Sensores RFID</CardTitle>
            <p className="text-slate-500 text-sm mt-1">
              Configure os sensores que monitoram a movimentação entre ambientes
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            Novo Sensor
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Sensor</TableHead>
                <TableHead>Fluxo de Movimentação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    Nenhum sensor cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                sensors.map((sensor) => {
                  const exitEnv = getEnvironmentById(sensor.exit_to_ambiente);
                  const entryEnv = getEnvironmentById(sensor.entry_to_ambiente);
                  
                  return (
                    <TableRow key={sensor.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Radio className="w-5 h-5 text-purple-600" />
                          <span className="text-slate-900">{sensor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-slate-100">
                            {exitEnv?.name || 'Desconhecido'}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {entryEnv?.name || 'Desconhecido'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(sensor.id)}
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(sensor.id)}
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
              {editingSensor ? 'Editar Sensor' : 'Novo Sensor'}
            </DialogTitle>
            <DialogDescription>
              {editingSensor ? 'Atualize as informações do sensor RFID.' : 'Configure um novo sensor RFID definindo os ambientes de origem e destino.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Sensor *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Sensor TI -> Almoxarifado"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exit-environment">Ambiente de Saída *</Label>
                <Select
                  value={formData.exitEnvironmentId}
                  onValueChange={(value: string) => setFormData({ ...formData, exitEnvironmentId: value })}
                >
                  <SelectTrigger id="exit-environment">
                    <SelectValue placeholder="Selecione o ambiente de origem" />
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

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-environment">Ambiente de Entrada *</Label>
                <Select
                  value={formData.entryEnvironmentId}
                  onValueChange={(value: string) => setFormData({ ...formData, entryEnvironmentId: value })}
                >
                  <SelectTrigger id="entry-environment">
                    <SelectValue placeholder="Selecione o ambiente de destino" />
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
                {editingSensor ? 'Atualizar' : 'Cadastrar'}
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
              Tem certeza que deseja excluir este sensor? Os registros de movimentação existentes serão mantidos.
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