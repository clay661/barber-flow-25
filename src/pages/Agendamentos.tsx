import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  Edit,
  X
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { DeleteConfirmDialog } from '@/components/forms/DeleteConfirmDialog';

const getStatusBadge = (status: string) => {
  const variants = {
    "CONFIRMADO": "default",
    "PENDENTE": "secondary", 
    "CONCLUIDO": "default",
    "CANCELADO": "destructive"
  } as const;
  
  const labels = {
    "CONFIRMADO": "Confirmado",
    "PENDENTE": "Pendente",
    "CONCLUIDO": "Concluído", 
    "CANCELADO": "Cancelado"
  } as const;
  
  return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
    {labels[status as keyof typeof labels] || status}
  </Badge>;
};

export default function Agendamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  const { appointments, loading: appointmentsLoading, createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.employee?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
    const matchesDate = appointmentDate === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  const handleCreateAppointment = async (data: Omit<Appointment, 'id' | 'created_at' | 'client' | 'employee' | 'service'>) => {
    setLoading(true);
    try {
      await createAppointment(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment = async (data: Omit<Appointment, 'id' | 'created_at' | 'client' | 'employee' | 'service'>) => {
    if (!editingAppointment) return;
    
    setLoading(true);
    try {
      await updateAppointment(editingAppointment.id, data);
      setEditingAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    
    setLoading(true);
    try {
      await deleteAppointment(appointmentToDelete.id);
      setAppointmentToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentFormOpen(true);
  };

  const openDeleteDialog = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return appointmentDate === today;
  }).length;
  const confirmedAppointments = appointments.filter(a => a.status === "CONFIRMADO").length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos da barbearia
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto"
          onClick={() => {
            setEditingAppointment(null);
            setAppointmentFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{todayAppointments}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">{totalAppointments}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">{confirmedAppointments}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              R$ {filteredAppointments.reduce((sum, a) => sum + (a.total_price || a.service?.price || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="p-4 sm:p-0 mb-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar agendamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] sm:w-auto">Cliente</TableHead>
                  <TableHead className="w-[120px] sm:w-auto hidden md:table-cell">Serviço</TableHead>
                  <TableHead className="w-[100px] sm:w-auto hidden lg:table-cell">Funcionário</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Horário</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Status</TableHead>
                  <TableHead className="w-[80px] sm:w-auto hidden sm:table-cell">Valor</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando agendamentos...
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {searchTerm ? 'Nenhum agendamento encontrado com esse filtro.' : 'Nenhum agendamento para esta data.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{appointment.client?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-accent" />
                          <span className="text-sm">{appointment.service?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{appointment.employee?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(appointment.date).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="font-medium hidden sm:table-cell text-sm">
                        R$ {appointment.total_price || appointment.service?.price || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openEditForm(appointment)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openDeleteDialog(appointment)}
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AppointmentForm
        open={appointmentFormOpen}
        onOpenChange={setAppointmentFormOpen}
        appointment={editingAppointment}
        onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}
        loading={loading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteAppointment}
        title="Excluir Agendamento"
        description={`Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.`}
        loading={loading}
      />
    </div>
  );
}