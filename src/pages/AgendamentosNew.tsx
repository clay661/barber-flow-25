import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon,
  Clock,
  User,
  X,
  Check,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppointments, Appointment } from "@/hooks/useAppointments";
import { useClients } from "@/hooks/useClients";
import { useEmployees } from "@/hooks/useEmployees";
import { useServices } from "@/hooks/useServices";

export default function Agendamentos() {
  const { appointments, loading, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { clients } = useClients();
  const { employees } = useEmployees();
  const { services } = useServices();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    client_id: "",
    employee_id: "",
    service_id: "",
    date: "",
    status: "PENDENTE" as "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO",
    notes: "",
    total_price: 0
  });

  // Atualizar preço quando serviço for selecionado
  useEffect(() => {
    if (formData.service_id) {
      const selectedService = services.find(s => s.id === formData.service_id);
      if (selectedService) {
        setFormData(prev => ({ ...prev, total_price: selectedService.price }));
      }
    }
  }, [formData.service_id, services]);

  const filteredAppointments = appointments.filter(appointment =>
    (appointment.client?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (appointment.employee?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (appointment.service?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        client_id: appointment.client_id || "",
        employee_id: appointment.employee_id || "",
        service_id: appointment.service_id || "",
        date: appointment.date.slice(0, 16), // Format for datetime-local input
        status: appointment.status as typeof formData.status,
        notes: appointment.notes || "",
        total_price: appointment.total_price || 0
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        client_id: "",
        employee_id: "",
        service_id: "",
        date: "",
        status: "PENDENTE",
        notes: "",
        total_price: 0
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAppointment(null);
    setFormData({
      client_id: "",
      employee_id: "",
      service_id: "",
      date: "",
      status: "PENDENTE",
      notes: "",
      total_price: 0
    });
  };

  const handleSave = async () => {
    if (!formData.client_id || !formData.employee_id || !formData.service_id || !formData.date) {
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };

      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deletingAppointment) {
      try {
        await deleteAppointment(deletingAppointment.id);
        setIsDeleteDialogOpen(false);
        setDeletingAppointment(null);
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
      }
    }
  };

  const openDeleteDialog = (appointment: Appointment) => {
    setDeletingAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PENDENTE': { variant: 'secondary' as const, icon: AlertCircle, text: 'Pendente' },
      'CONFIRMADO': { variant: 'default' as const, icon: CheckCircle, text: 'Confirmado' },
      'CANCELADO': { variant: 'destructive' as const, icon: XCircle, text: 'Cancelado' },
      'CONCLUIDO': { variant: 'default' as const, icon: CheckCircle, text: 'Concluído' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    if (!config) return null;
    
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="text-xs flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  const pendingAppointments = appointments.filter(a => a.status === 'PENDENTE');
  const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMADO');

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos dos clientes
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{todayAppointments.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-warning">{pendingAppointments.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">{confirmedAppointments.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{appointments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="p-4 sm:p-0 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, funcionário, serviço ou status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] sm:w-auto">Cliente</TableHead>
                  <TableHead className="w-[120px] sm:w-auto">Funcionário</TableHead>
                  <TableHead className="w-[120px] sm:w-auto hidden md:table-cell">Serviço</TableHead>
                  <TableHead className="w-[140px] sm:w-auto">Data/Hora</TableHead>
                  <TableHead className="w-[80px] sm:w-auto hidden lg:table-cell">Preço</TableHead>
                  <TableHead className="w-[100px] sm:w-auto">Status</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="font-medium text-sm">{appointment.client?.name || 'Cliente não encontrado'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{appointment.employee?.name || 'Funcionário não encontrado'}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">{appointment.service?.name || 'Serviço não encontrado'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                        {new Date(appointment.date).toLocaleString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm font-medium">
                        {appointment.total_price ? formatPrice(appointment.total_price) : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9"
                          onClick={() => handleOpenDialog(appointment)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9"
                          onClick={() => openDeleteDialog(appointment)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={formData.client_id} onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.filter(c => c.status === 'ativo').map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="employee">Funcionário</Label>
              <Select value={formData.employee_id} onValueChange={(value) => setFormData(prev => ({ ...prev, employee_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter(e => e.status === 'ativo').map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="service">Serviço</Label>
              <Select value={formData.service_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.filter(s => s.status === 'ativo').map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {formatPrice(service.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Data e Hora</Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as typeof formData.status }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="total_price">Preço Total (R$)</Label>
              <Input
                id="total_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_price}
                onChange={(e) => setFormData(prev => ({ ...prev, total_price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Observações sobre o agendamento..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="hover-gold" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {!isSubmitting && <Check className="h-4 w-4 mr-2" />}
              {editingAppointment ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}