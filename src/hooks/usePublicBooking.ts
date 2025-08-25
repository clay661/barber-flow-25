import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PublicSalonSettings {
  id: string;
  name: string;
  logo_url: string | null;
  banner_url: string | null;
}

export interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  category: string;
}

export interface Employee {
  id: string;
  name: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  selectedServices: string[];
  selectedEmployee: string;
  selectedDate: string;
  selectedTime: string;
}

export function usePublicBooking(publicLink: string) {
  const [salonSettings, setSalonSettings] = useState<PublicSalonSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalonData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch salon settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('salon_settings')
        .select('id, name, logo_url, banner_url')
        .eq('public_link', publicLink)
        .single();

      if (settingsError || !settingsData) {
        throw new Error('Salão não encontrado');
      }

      setSalonSettings(settingsData);

      // Fetch active services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, duration_minutes, price, category')
        .eq('status', 'ativo')
        .order('name');

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // Fetch active employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('status', 'ativo')
        .order('name');

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

    } catch (err: any) {
      console.error('Error fetching salon data:', err);
      setError(err.message || 'Erro ao carregar dados do salão');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = async (date: string, serviceIds: string[], employeeId: string): Promise<TimeSlot[]> => {
    if (!serviceIds.length || !employeeId || !date) return [];

    try {
      // Calculate total duration
      const selectedServices = services.filter(s => serviceIds.includes(s.id));
      const totalDuration = selectedServices.reduce((acc, service) => acc + service.duration_minutes, 0);

      // Get existing appointments for the date and employee
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('date, service_id')
        .eq('employee_id', employeeId)
        .gte('date', `${date}T00:00:00`)
        .lt('date', `${date}T23:59:59`)
        .eq('status', 'CONFIRMADO');

      if (error) throw error;

      // Generate time slots (8:00 to 18:00, 30-minute intervals)
      const slots: TimeSlot[] = [];
      const startHour = 8;
      const endHour = 18;
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const slotDateTime = new Date(`${date}T${time}:00`);
          
          // Check if slot has enough time for all services
          const slotEndTime = new Date(slotDateTime.getTime() + totalDuration * 60000);
          const maxEndTime = new Date(`${date}T${endHour}:00:00`);
          
          if (slotEndTime > maxEndTime) {
            continue; // Skip if services would extend beyond working hours
          }

          // Check for conflicts with existing appointments
          const hasConflict = appointments?.some(apt => {
            const aptDate = new Date(apt.date);
            const aptService = services.find(s => s.id === apt.service_id);
            if (!aptService) return false;
            
            const aptEndTime = new Date(aptDate.getTime() + aptService.duration_minutes * 60000);
            
            return (
              (slotDateTime >= aptDate && slotDateTime < aptEndTime) ||
              (slotEndTime > aptDate && slotEndTime <= aptEndTime) ||
              (slotDateTime <= aptDate && slotEndTime >= aptEndTime)
            );
          });

          slots.push({
            time,
            available: !hasConflict
          });
        }
      }

      return slots;
    } catch (error) {
      console.error('Error generating time slots:', error);
      return [];
    }
  };

  const createBooking = async (bookingData: BookingData) => {
    try {
      // Create or get client
      let clientId: string;
      
      // Check if client exists by phone or email
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .or(`telefone.eq.${bookingData.clientPhone},email.eq.${bookingData.clientEmail}`)
        .single();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        // Create new client
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: bookingData.clientName,
            telefone: bookingData.clientPhone,
            email: bookingData.clientEmail || null,
            status: 'ativo'
          })
          .select('id')
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // Calculate total price
      const selectedServices = services.filter(s => bookingData.selectedServices.includes(s.id));
      const totalPrice = selectedServices.reduce((acc, service) => acc + Number(service.price), 0);

      // Create appointments for each service
      const appointmentPromises = [];
      let currentTime = new Date(`${bookingData.selectedDate}T${bookingData.selectedTime}:00`);

      for (const serviceId of bookingData.selectedServices) {
        const service = services.find(s => s.id === serviceId);
        if (!service) continue;

        const appointmentData = {
          client_id: clientId,
          employee_id: bookingData.selectedEmployee,
          service_id: serviceId,
          date: currentTime.toISOString(),
          status: 'PENDENTE',
          total_price: service.price,
          notes: `Agendamento via site público`
        };

        appointmentPromises.push(
          supabase
            .from('appointments')
            .insert(appointmentData)
            .select('id')
            .single()
        );

        // Update time for next service
        currentTime = new Date(currentTime.getTime() + service.duration_minutes * 60000);
      }

      const appointmentResults = await Promise.all(appointmentPromises);
      
      // Check for errors
      for (const result of appointmentResults) {
        if (result.error) throw result.error;
      }

      // Enviar notificação de confirmação
      if (appointmentResults.length > 0 && appointmentResults[0].data) {
        try {
          const employeeName = employees.find(e => e.id === bookingData.selectedEmployee)?.name || 'Profissional';
          const salonName = salonSettings?.name || 'Salão';
          const serviceNames = selectedServices.map(s => s.name).join(', ');
          const appointmentDate = new Date(`${bookingData.selectedDate}T${bookingData.selectedTime}:00`);
          const formattedDate = appointmentDate.toLocaleDateString('pt-BR');
          const formattedTime = appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          const message = `Olá ${bookingData.clientName}, seu agendamento em ${salonName} foi confirmado para ${formattedDate} às ${formattedTime}. Serviços: ${serviceNames}. Profissional: ${employeeName}.`;

          // Enviar notificação usando o primeiro agendamento criado como referência
          await supabase.functions.invoke('send-notification', {
            body: {
              clientPhone: bookingData.clientPhone,
              message: message,
              appointmentId: appointmentResults[0].data.id
            }
          });
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError);
          // Não falhar o agendamento se a notificação falhar
        }
      }

      return { success: true };

    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (publicLink) {
      fetchSalonData();
    }
  }, [publicLink]);

  return {
    salonSettings,
    services,
    employees,
    loading,
    error,
    generateTimeSlots,
    createBooking,
    refetch: fetchSalonData
  };
}