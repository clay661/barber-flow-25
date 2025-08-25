import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailRequest {
  appointmentId: string;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  employeeName: string;
  appointmentDate: string;
  appointmentTime: string;
  salonName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      appointmentId, 
      clientEmail, 
      clientName, 
      serviceName, 
      employeeName, 
      appointmentDate, 
      appointmentTime, 
      salonName 
    }: AppointmentEmailRequest = await req.json();

    console.log('Sending appointment email:', { appointmentId, clientEmail, clientName });

    // Verificar se as notificações por e-mail estão ativadas
    const { data: settings } = await supabase
      .from('salon_settings')
      .select('email_notifications_enabled')
      .single();

    if (!settings?.email_notifications_enabled) {
      console.log('Email notifications are disabled');
      return new Response(JSON.stringify({ message: 'Email notifications disabled' }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formattedDate = new Date(appointmentDate).toLocaleDateString('pt-BR');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">${salonName}</h1>
        <h2 style="color: #374151;">Confirmação de Agendamento</h2>
        
        <p>Olá <strong>${clientName}</strong>,</p>
        
        <p>Seu agendamento foi confirmado com sucesso! Seguem os detalhes:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Serviço:</strong> ${serviceName}</p>
          <p><strong>Funcionário:</strong> ${employeeName}</p>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <p><strong>Horário:</strong> ${appointmentTime}</p>
        </div>
        
        <p>Agradecemos sua preferência!</p>
        <p>Atenciosamente,<br><strong>${salonName}</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Este é um e-mail automático, não responda a esta mensagem.
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: `${salonName} <onboarding@resend.dev>`,
      to: [clientEmail],
      subject: `Confirmação de Agendamento - ${salonName}`,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error('Error sending appointment email:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);