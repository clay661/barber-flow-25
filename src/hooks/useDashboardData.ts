import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalTenants: number;
  totalUsers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
}

export interface RecentPayment {
  id: string;
  tenant_name: string;
  amount: number;
  currency: string;
  status: string;
  payment_date: string;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    canceledSubscriptions: 0
  });
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    try {
      // Buscar total de tenants
      const { count: totalTenants } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true });

      // Buscar total de funcionários
      const { count: totalUsers } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });

      // Buscar assinaturas ativas e canceladas
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('status');

      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
      const canceledSubscriptions = subscriptions?.filter(s => s.status === 'canceled').length || 0;

      // Buscar receita mensal do mês atual
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: payments } = await supabase
        .from('payment_history')
        .select('amount')
        .gte('payment_date', firstDay.toISOString())
        .lte('payment_date', lastDay.toISOString())
        .eq('status', 'succeeded');

      const monthlyRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      setStats({
        totalTenants: totalTenants || 0,
        totalUsers: totalUsers || 0,
        monthlyRevenue,
        activeSubscriptions,
        canceledSubscriptions
      });

      console.info("OK: Dashboard stats carregadas");
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas do dashboard",
        variant: "destructive",
      });
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select(`
          id,
          amount,
          currency,
          status,
          payment_date,
          subscription_id,
          subscriptions!inner(
            tenant_id,
            tenants!inner(
              name
            )
          )
        `)
        .order('payment_date', { ascending: false })
        .limit(5);

      if (error) throw error;

      const formattedPayments: RecentPayment[] = (data || []).map(payment => ({
        id: payment.id,
        tenant_name: (payment.subscriptions as any)?.tenants?.name || 'Empresa desconhecida',
        amount: Number(payment.amount),
        currency: payment.currency || 'BRL',
        status: payment.status,
        payment_date: payment.payment_date
      }));

      setRecentPayments(formattedPayments);
      console.info("OK: Recent payments carregados");
    } catch (error) {
      console.error('Error fetching recent payments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pagamentos recentes",
        variant: "destructive",
      });
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchDashboardStats(),
      fetchRecentPayments()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    stats,
    recentPayments,
    loading,
    refetch: fetchAllData
  };
}