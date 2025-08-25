import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Checking for appointments requiring reminders...');

    // Buscar agendamentos que ocorrerão em 1 hora
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

    const fiftyMinutesFromNow = new Date();
    fiftyMinutesFromNow.setMinutes(fiftyMinutesFromNow.getMinutes() + 50);

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        id,
        date,
        clients!inner(
          name,
          telefone,
          email
        ),
        services!inner(
          name,
          duration_minutes
        ),
        employees!inner(
          name
        )
      `)
      .gte('date', fiftyMinutesFromNow.toISOString())
      .lte('date', oneHourFromNow.toISOString())
      .eq('status', 'CONFIRMADO');

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    console.log(`Found ${appointments?.length || 0} appointments for reminders`);

    // Verificar configurações de notificação ativas
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (settingsError || !settings) {
      console.log('No active notification settings found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No active notification settings configured',
          reminders_sent: 0 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let remindersSent = 0;

    // Enviar lembretes para cada agendamento
    for (const appointment of appointments || []) {
      const appointmentDate = new Date(appointment.date);
      const client = appointment.clients;
      const service = appointment.services;
      const employee = appointment.employees;

      const message = `Olá ${client.name}! Lembrete: você tem um agendamento de ${service.name} com ${employee.name} hoje às ${appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Até logo!`;

      try {
        // Chamar a função send-notification
        const { error: notificationError } = await supabase.functions.invoke('send-notification', {
          body: {
            clientPhone: client.telefone,
            message,
            appointmentId: appointment.id
          }
        });

        if (notificationError) {
          console.error(`Error sending reminder for appointment ${appointment.id}:`, notificationError);
        } else {
          remindersSent++;
          console.log(`Reminder sent for appointment ${appointment.id}`);
        }
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, error);
      }
    }

    console.log(`Successfully sent ${remindersSent} reminders`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        reminders_sent: remindersSent,
        appointments_checked: appointments?.length || 0
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in appointment-reminders function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});