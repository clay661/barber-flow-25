import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  clientPhone: string;
  message: string;
  appointmentId: string;
}

interface NotificationSettings {
  provider: string;
  api_key_sid: string;
  auth_token: string;
  phone_number: string;
  is_active: boolean;
  notification_mode: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_password?: string;
  from_email?: string;
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

    const { clientPhone, message, appointmentId }: NotificationRequest = await req.json();

    console.log('Sending notification:', { clientPhone, appointmentId });

    // Buscar configurações de notificação ativas
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (settingsError || !settings) {
      console.error('No active notification settings found:', settingsError);
      
      // Registrar tentativa falhada no histórico
      await supabase
        .from('notification_history')
        .insert({
          appointment_id: appointmentId,
          client_phone: clientPhone,
          message,
          provider: 'none',
          status: 'failed',
          provider_response: { error: 'No active notification settings configured' }
        });

      return new Response(
        JSON.stringify({ success: false, error: 'No active notification settings configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;
    const typedSettings = settings as NotificationSettings;

    // Enviar notificação baseado no modo selecionado
    if (typedSettings.notification_mode === 'email' || typedSettings.notification_mode === 'both') {
      // Enviar e-mail
      try {
        const emailResult = await sendEmailMessage(typedSettings, clientPhone, message);
        if (typedSettings.notification_mode === 'email') {
          result = emailResult;
        } else {
          // Se for 'both', precisamos enviar SMS/WhatsApp também
          const smsResult = await sendSMSWhatsApp(typedSettings, clientPhone, message);
          result = {
            success: emailResult.success && smsResult.success,
            response: {
              email: emailResult.response,
              sms: smsResult.response
            }
          };
        }
      } catch (error) {
        console.error('Error sending email:', error);
        result = {
          success: false,
          response: { error: error.message }
        };
      }
    } else {
      // Somente SMS/WhatsApp
      result = await sendSMSWhatsApp(typedSettings, clientPhone, message);
    }

    // Registrar no histórico
    const historyProvider = typedSettings.notification_mode === 'both' ? 'both' : 
                           typedSettings.notification_mode === 'email' ? 'email' : 
                           typedSettings.provider;
    
    await supabase
      .from('notification_history')
      .insert({
        appointment_id: appointmentId,
        client_phone: clientPhone,
        message,
        provider: historyProvider,
        status: result.success ? 'sent' : 'failed',
        provider_response: result.response
      });

    console.log('Notification result:', result);

    return new Response(
      JSON.stringify({ success: result.success, data: result.response }),
      { 
        status: result.success ? 200 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-notification function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function sendSMSWhatsApp(settings: NotificationSettings, to: string, message: string) {
  switch (settings.provider) {
    case 'twilio':
      return await sendTwilioMessage(settings, to, message);
    case 'ultramsg':
      return await sendUltraMsgMessage(settings, to, message);
    default:
      throw new Error(`Unsupported provider: ${settings.provider}`);
  }
}

async function sendEmailMessage(settings: NotificationSettings, clientPhone: string, message: string) {
  try {
    // Simular envio de e-mail via SMTP
    // Em produção, você usaria uma biblioteca como nodemailer ou um serviço como SendGrid
    
    const emailData = {
      from: settings.from_email,
      to: `cliente@email.com`, // Em produção, você pegaria o e-mail do cliente
      subject: 'Confirmação de Agendamento',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Confirmação de Agendamento</h2>
          <p>${message}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Esta é uma mensagem automática. Não responda este e-mail.
          </p>
        </div>
      `
    };

    // Simular resposta positiva (substitua por implementação SMTP real)
    console.log('Email would be sent with data:', emailData);
    
    return {
      success: true,
      response: {
        messageId: `email_${Date.now()}`,
        status: 'sent',
        to: emailData.to,
        subject: emailData.subject
      }
    };
  } catch (error) {
    return {
      success: false,
      response: { error: error.message }
    };
  }
}

async function sendTwilioMessage(settings: NotificationSettings, to: string, message: string) {
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${settings.api_key_sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${settings.api_key_sid}:${settings.auth_token}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: settings.phone_number,
          To: to,
          Body: message,
        }),
      }
    );

    const data = await response.json();
    
    return {
      success: response.ok,
      response: data
    };
  } catch (error) {
    return {
      success: false,
      response: { error: error.message }
    };
  }
}

async function sendUltraMsgMessage(settings: NotificationSettings, to: string, message: string) {
  try {
    // Limpar número de telefone (remover formatação)
    const cleanPhone = to.replace(/\D/g, '');
    const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    const response = await fetch('https://api.ultramsg.com/instance' + settings.api_key_sid + '/messages/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: settings.auth_token,
        to: `${phoneWithCountryCode}@c.us`,
        body: message,
      }),
    });

    const data = await response.json();
    
    return {
      success: response.ok && data.sent,
      response: data
    };
  } catch (error) {
    return {
      success: false,
      response: { error: error.message }
    };
  }
}