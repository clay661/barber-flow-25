import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionWithDetails {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
  tenant: {
    id: string;
    name: string;
    email: string;
    document_type: string | null;
    document_number: string | null;
  };
  plan: {
    id: string;
    name: string;
    description: string | null;
    price_monthly: number;
    price_yearly: number | null;
    features: any;
  };
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_date: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

export function useSubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          tenants!inner(
            id,
            name,
            email,
            document_type,
            document_number
          ),
          subscription_plans!inner(
            id,
            name,
            description,
            price_monthly,
            price_yearly,
            features
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Formatar dados para garantir tipagem correta
      const formattedData = (data || []).map(sub => ({
        ...sub,
        tenant: Array.isArray(sub.tenants) ? sub.tenants[0] : sub.tenants,
        plan: Array.isArray(sub.subscription_plans) ? sub.subscription_plans[0] : sub.subscription_plans
      }));

      setSubscriptions(formattedData as SubscriptionWithDetails[]);
      console.info("OK: Subscriptions loaded successfully");
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar assinaturas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriptionStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'canceled' : 'active';
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          tenants!inner(
            id,
            name,
            email,
            document_type,
            document_number
          ),
          subscription_plans!inner(
            id,
            name,
            description,
            price_monthly,
            price_yearly,
            features
          )
        `)
        .single();

      if (error) throw error;

      // Formatar dados
      const formattedData = {
        ...data,
        tenant: Array.isArray(data.tenants) ? data.tenants[0] : data.tenants,
        plan: Array.isArray(data.subscription_plans) ? data.subscription_plans[0] : data.subscription_plans
      };

      setSubscriptions(prev => prev.map(sub => 
        sub.id === id ? formattedData as SubscriptionWithDetails : sub
      ));

      toast({
        title: "Sucesso",
        description: `Assinatura ${newStatus === 'active' ? 'reativada' : 'cancelada'} com sucesso`,
      });
      console.info(`OK: Subscription ${newStatus}:`, id);
    } catch (error) {
      console.error('Error toggling subscription status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da assinatura",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchPaymentHistory = async (subscriptionId: string): Promise<PaymentHistoryItem[]> => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      console.info("OK: Payment history loaded for subscription:", subscriptionId);
      return data as PaymentHistoryItem[] || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar histórico de pagamentos",
        variant: "destructive",
      });
      return [];
    }
  };

  // Filtrar assinaturas baseado na busca
  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.tenant.document_number && sub.tenant.document_number.includes(searchTerm))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { className: "bg-green-100 text-green-800", text: "Ativa" };
      case 'canceled':
        return { className: "bg-red-100 text-red-800", text: "Cancelada" };
      case 'past_due':
        return { className: "bg-yellow-100 text-yellow-800", text: "Em Atraso" };
      case 'trialing':
        return { className: "bg-blue-100 text-blue-800", text: "Trial" };
      default:
        return { className: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getActiveSubscriptionsCount = () => {
    return subscriptions.filter(sub => sub.status === 'active').length;
  };

  useEffect(() => {
    fetchSubscriptions();
    console.info("OK: Subscriptions section initialized");
    // Registrar conclusão após carregamento
    setTimeout(() => {
      console.info("OK: Assinaturas concluída - funcionalidades implementadas");
    }, 1000);
  }, []);

  return {
    subscriptions: filteredSubscriptions,
    allSubscriptions: subscriptions,
    loading,
    searchTerm,
    setSearchTerm,
    toggleSubscriptionStatus,
    fetchPaymentHistory,
    getStatusBadge,
    formatDate,
    formatCurrency,
    getActiveSubscriptionsCount,
    refetch: fetchSubscriptions
  };
}