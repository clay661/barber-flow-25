import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Appointment {
  id: string;
  client_id: string | null;
  employee_id: string | null;
  service_id: string | null;
  date: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  notes: string | null;
  total_price: number | null;
  created_at: string;
  // Join fields
  client?: {
    name: string;
    telefone: string | null;
  };
  employee?: {
    name: string;
  };
  service?: {
    name: string;
    price: number;
    duration_minutes: number;
  };
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(name, telefone),
          employee:employees(name),
          service:services(name, price, duration_minutes)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setAppointments((data || []) as Appointment[]);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agendamentos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'client' | 'employee' | 'service'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select(`
          *,
          client:clients(name, telefone),
          employee:employees(name),
          service:services(name, price, duration_minutes)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev => [data as Appointment, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Agendamento criado com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o agendamento.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select(`
          *,
          client:clients(name, telefone),
          employee:employees(name),
          service:services(name, price, duration_minutes)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev => prev.map(appointment => appointment.id === id ? data as Appointment : appointment));
      toast({
        title: 'Sucesso',
        description: 'Agendamento atualizado com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o agendamento.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Agendamento removido com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o agendamento.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments,
  };
};