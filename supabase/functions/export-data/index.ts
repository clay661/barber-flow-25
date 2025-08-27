import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateCSV(data: any[], headers: string[]): string {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes in CSV
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, format, dateFrom, dateTo } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';

    switch (type) {
      case 'clients':
        const { data: clients } = await supabase
          .from('clients')
          .select('name, email, telefone, total_visits, created_at')
          .order('created_at', { ascending: false });
        
        data = clients || [];
        headers = ['name', 'email', 'telefone', 'total_visits', 'created_at'];
        filename = 'clientes.csv';
        break;

      case 'appointments':
        let appointmentsQuery = supabase
          .from('appointments')
          .select(`
            date,
            status,
            total_price,
            notes,
            clients(name, telefone),
            employees(name),
            services(name, price)
          `)
          .order('date', { ascending: false });
        
        if (dateFrom) {
          appointmentsQuery = appointmentsQuery.gte('date', dateFrom);
        }
        if (dateTo) {
          appointmentsQuery = appointmentsQuery.lte('date', dateTo);
        }
        
        const { data: appointments } = await appointmentsQuery;
        
        data = (appointments || []).map(apt => ({
          data: apt.date,
          cliente: apt.clients?.name || 'N/A',
          telefone: apt.clients?.telefone || 'N/A',
          funcionario: apt.employees?.name || 'N/A',
          servico: apt.services?.name || 'N/A',
          preco: apt.services?.price || apt.total_price || 0,
          status: apt.status,
          observacoes: apt.notes || ''
        }));
        
        headers = ['data', 'cliente', 'telefone', 'funcionario', 'servico', 'preco', 'status', 'observacoes'];
        filename = 'agendamentos.csv';
        break;

      case 'services':
        const { data: services } = await supabase
          .from('services')
          .select('name, category, price, duration_minutes, status, created_at')
          .order('created_at', { ascending: false });
        
        data = services || [];
        headers = ['name', 'category', 'price', 'duration_minutes', 'status', 'created_at'];
        filename = 'servicos.csv';
        break;

      case 'employees':
        const { data: employees } = await supabase
          .from('employees')
          .select('name, pro_email, telefone, role, status, commission_type, commission_value, created_at')
          .order('created_at', { ascending: false });
        
        data = (employees || []).map(emp => ({
          ...emp,
          pro_password: undefined // Remove password from export
        }));
        
        headers = ['name', 'pro_email', 'telefone', 'role', 'status', 'commission_type', 'commission_value', 'created_at'];
        filename = 'funcionarios.csv';
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Tipo de exportação inválido' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

    // Generate CSV content
    const csvContent = generateCSV(data, headers);
    
    // Create a blob URL for download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Convert to base64 for response
    const base64Content = btoa(unescape(encodeURIComponent('\uFEFF' + csvContent)));

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: base64Content,
        filename: filename,
        mimeType: 'text/csv;charset=utf-8;'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao exportar dados' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});