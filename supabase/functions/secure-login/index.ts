import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, userType } = await req.json();
    
    // Create Supabase client with service role for secure operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    let userData = null;
    let tableName = '';
    let passwordField = '';

    // Determine which table to query based on user type
    if (userType === 'super_admin') {
      tableName = 'super_admins';
      passwordField = 'password_hash';
    } else {
      tableName = 'employees';
      passwordField = 'pro_password';
    }

    // Get user data
    const emailField = userType === 'super_admin' ? 'email' : 'pro_email';
    const { data: user, error: userError } = await supabase
      .from(tableName)
      .select('*')
      .eq(emailField, email)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais inválidas' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // For employees, check if status is active
    if (userType === 'employee' && user.status !== 'ativo') {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuário inativo' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Verify password using the database function
    const { data: passwordValid, error: verifyError } = await supabase
      .rpc('verify_password', {
        password: password,
        hash: user[passwordField]
      });

    if (verifyError || !passwordValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais inválidas' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Remove password from response
    delete user[passwordField];

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: user,
        userType: userType 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});