import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Appointment } from '@/hooks/useAppointments';
import { useClients } from '@/hooks/useClients';
import { useServices } from '@/hooks/useServices';
import { useEmployees } from '@/hooks/useEmployees';

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Appointment, 'id' | 'created_at' | 'client' | 'employee' | 'service'>) => Promise<void>;
  appointment?: Appointment | null;
  loading?: boolean;
}

export function AppointmentForm({ open, onOpenChange, onSubmit, appointment, loading = false }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    client_id: '',
    employee_id: '',
    service_id: '',
    date: '',
    status: 'PENDENTE' as Appointment['status'],
    notes: '',
    total_price: '',
  });

  const { clients } = useClients();
  const { services } = useServices();
  const { employees } = useEmployees();

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.date);
      const dateString = appointmentDate.toISOString().slice(0, 16);
      
      setFormData({
        client_id: appointment.client_id || '',
        employee_id: appointment.employee_id || '',
        service_id: appointment.service_id || '',
        date: dateString,
        status: appointment.status,
        notes: appointment.notes || '',
        total_price: appointment.total_price?.toString() || '',
      });
    } else {
      const now = new Date();
      const defaultDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      const dateString = defaultDate.toISOString().slice(0, 16);
      
      setFormData({
        client_id: '',
        employee_id: '',
        service_id: '',
        date: dateString,
        status: 'PENDENTE',
        notes: '',
        total_price: '',
      });
    }
  }, [appointment, open]);

  // Auto-fill price when service is selected
  useEffect(() => {
    if (formData.service_id && !appointment) {
      const selectedService = services.find(s => s.id === formData.service_id);
      if (selectedService) {
        setFormData(prev => ({ ...prev, total_price: selectedService.price.toString() }));
      }
    }
  }, [formData.service_id, services, appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      client_id: formData.client_id || null,
      employee_id: formData.employee_id || null,
      service_id: formData.service_id || null,
      date: formData.date,
      status: formData.status,
      notes: formData.notes || null,
      total_price: formData.total_price ? parseFloat(formData.total_price) : null,
    };

    await onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription>
            {appointment ? 'Atualize as informações do agendamento.' : 'Cadastre um novo agendamento no sistema.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_id">Cliente *</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_id">Serviço *</Label>
            <Select
              value={formData.service_id}
              onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.filter(s => s.status === 'ativo').map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R$ {service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_id">Funcionário</Label>
            <Select
              value={formData.employee_id}
              onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o funcionário" />
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

          <div className="space-y-2">
            <Label htmlFor="date">Data e Hora *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Appointment['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                  <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_price">Valor (R$)</Label>
              <Input
                id="total_price"
                type="number"
                step="0.01"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações adicionais..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (appointment ? 'Atualizar' : 'Agendar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}