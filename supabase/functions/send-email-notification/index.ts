
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const { to, subject, html, appointmentId, clientName } = await req.json();

    // Buscar configurações do salão
    const { data: salonSettings } = await supabaseClient
      .from("salon_settings")
      .select("name, logo_url")
      .single();

    const salonName = salonSettings?.name || "Seu Salão";
    const logoUrl = salonSettings?.logo_url;

    // Template de email personalizado
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { max-width: 150px; height: auto; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ${logoUrl ? `<img src="${logoUrl}" alt="${salonName}" class="logo">` : ''}
              <h1>${salonName}</h1>
            </div>
            <div class="content">
              <h2>Olá, ${clientName}!</h2>
              ${html}
            </div>
            <div class="footer">
              <p>Este email foi enviado automaticamente pelo sistema de agendamentos do ${salonName}.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: `${salonName} <noreply@resend.dev>`,
      to: [to],
      subject: subject,
      html: emailHtml,
    });

    // Registrar no histórico
    await supabaseClient.from("notification_history").insert({
      appointment_id: appointmentId,
      client_phone: to, // Usar campo phone para email também
      message: subject,
      provider: "resend",
      status: "sent",
      provider_response: emailResponse,
    });

    return new Response(JSON.stringify({ success: true, result: emailResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
