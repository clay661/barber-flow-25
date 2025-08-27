import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { publicLink } = await req.json();
    
    if (!publicLink) {
      return new Response(
        JSON.stringify({ success: false, error: 'Link público é obrigatório' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Generate the public booking URL
    const baseUrl = req.headers.get('origin') || 'https://your-domain.com';
    const bookingUrl = `${baseUrl}/booking/${publicLink}`;
    
    // Generate QR code using QR Server API (free service)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(bookingUrl)}`;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        qrCodeUrl: qrApiUrl,
        bookingUrl: bookingUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('QR Code generation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao gerar QR Code' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});