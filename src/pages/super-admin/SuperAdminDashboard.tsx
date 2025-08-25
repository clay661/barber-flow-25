import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building2, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalTenants: number;
  totalUsers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  recentPayments: any[];
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    canceledSubscriptions: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Carregar estatísticas das empresas
      const { data: tenants } = await supabase
        .from('tenants')
        .select('*');

      // Carregar funcionários totais
      const { data: employees } = await supabase
        .from('employees')
        .select('id');

      // Carregar assinaturas
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*');

      // Carregar pagamentos recentes
      const { data: payments } = await supabase
        .from('payment_history')
        .select(`
          *,
          subscriptions!inner(
            tenants!inner(name)
          )
        `)
        .order('payment_date', { ascending: false })
        .limit(5);

      // Calcular receita mensal (simulado)
      const currentMonth = new Date().getMonth();
      const monthlyRevenue = payments?.reduce((total, payment) => {
        const paymentDate = new Date(payment.payment_date);
        if (paymentDate.getMonth() === currentMonth && payment.status === 'paid') {
          return total + parseFloat(payment.amount.toString());
        }
        return total;
      }, 0) || 0;

      setStats({
        totalTenants: tenants?.length || 0,
        totalUsers: employees?.length || 0,
        monthlyRevenue,
        activeSubscriptions: subscriptions?.filter(s => s.status === 'active').length || 0,
        canceledSubscriptions: subscriptions?.filter(s => s.status === 'canceled').length || 0,
        recentPayments: payments || []
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Super Admin</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral completa do sistema SaaS
        </p>
      </div>

      {/* Estatísticas principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              Empresas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Funcionários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Mês atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.canceledSubscriptions} canceladas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Últimos pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Pagamentos</CardTitle>
          <CardDescription>
            Histórico dos 5 pagamentos mais recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentPayments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum pagamento encontrado
              </p>
            ) : (
              stats.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      payment.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">
                        {payment.subscriptions?.tenants?.name || 'Empresa não identificada'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {parseFloat(payment.amount.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-sm ${
                      payment.status === 'paid' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}