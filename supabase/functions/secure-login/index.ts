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
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Use the verify_employee_password function
    const { data: empId, error: verifyError } = await supabase
      .rpc('verify_employee_password', {
        p_email: email,
        p_password: password
      });

    if (verifyError || !empId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais inválidas' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get full employee data
    const { data: user, error: userError } = await supabase
      .from('employees')
      .select('id, name, pro_email, role, custom_role_name, status, telefone, commission_type, commission_value, created_at')
      .eq('id', empId)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuário não encontrado' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    if (user.status !== 'ativo') {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuário inativo' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: user,
        userType: userType || 'employee'
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
