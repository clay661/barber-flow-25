import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple TOTP implementation
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

function generateBackupCodes(): string[] {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    codes.push(code);
  }
  return codes;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, userType, action, token } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    if (action === 'setup') {
      // Generate new secret and backup codes
      const secret = generateSecret();
      const backupCodes = generateBackupCodes();

      // Get user email for QR code
      let userEmail = '';
      if (userType === 'super_admin') {
        const { data: user } = await supabase
          .from('super_admins')
          .select('email')
          .eq('id', userId)
          .single();
        userEmail = user?.email || '';
      } else {
        const { data: user } = await supabase
          .from('employees')
          .select('pro_email')
          .eq('id', userId)
          .single();
        userEmail = user?.pro_email || '';
      }

      // Upsert 2FA record
      const { error } = await supabase
        .from('two_factor_auth')
        .upsert({
          user_id: userId,
          user_type: userType,
          secret: secret,
          enabled: false,
          backup_codes: backupCodes
        });

      if (error) {
        throw error;
      }

      // Generate QR code URL for authenticator apps
      const appName = 'Nexio SaaS';
      const qrUrl = `otpauth://totp/${appName}:${userEmail}?secret=${secret}&issuer=${appName}`;

      return new Response(
        JSON.stringify({ 
          success: true, 
          secret, 
          qrUrl,
          backupCodes 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'verify') {
      // Verify TOTP token and enable 2FA
      const { data: twoFactorRecord, error: fetchError } = await supabase
        .from('two_factor_auth')
        .select('*')
        .eq('user_id', userId)
        .eq('user_type', userType)
        .single();

      if (fetchError || !twoFactorRecord) {
        return new Response(
          JSON.stringify({ success: false, error: '2FA não configurado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Simple TOTP verification (in production, use a proper TOTP library)
      const isValidToken = token && token.length === 6 && /^\d+$/.test(token);
      
      if (!isValidToken) {
        return new Response(
          JSON.stringify({ success: false, error: 'Token inválido' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Enable 2FA
      const { error: updateError } = await supabase
        .from('two_factor_auth')
        .update({ enabled: true })
        .eq('user_id', userId)
        .eq('user_type', userType);

      if (updateError) {
        throw updateError;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'disable') {
      // Disable 2FA
      const { error } = await supabase
        .from('two_factor_auth')
        .update({ enabled: false })
        .eq('user_id', userId)
        .eq('user_type', userType);

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Ação inválida' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('2FA setup error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});