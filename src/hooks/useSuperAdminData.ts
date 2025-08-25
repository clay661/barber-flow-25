import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usage_limit: number | null;
  used_count: number;
  start_date: string | null;
  end_date: string | null;
  status: 'active' | 'paused' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  commission_rate: number;
  status: 'active' | 'paused' | 'inactive';
  total_clicks: number;
  total_conversions: number;
  total_commission: number;
  created_at: string;
  updated_at: string;
}

export interface SecuritySettings {
  id: string;
  two_factor_enabled: boolean;
  last_password_change: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  features: any;
  status: 'active' | 'inactive';
  stripe_price_id: string | null;
  trial_days: number;
  created_at: string;
  updated_at: string;
}

export function useDiscountCoupons() {
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data as DiscountCoupon[] || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar cupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (couponData: Omit<DiscountCoupon, 'id' | 'created_at' | 'updated_at' | 'used_count'>) => {
    try {
      const { data, error } = await supabase
        .from('discount_coupons')
        .insert([couponData])
        .select()
        .single();

      if (error) throw error;
      
      setCoupons(prev => [data as DiscountCoupon, ...prev]);
      toast({
        title: "Sucesso",
        description: "Cupom criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar cupom",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCoupon = async (id: string, updates: Partial<DiscountCoupon>) => {
    try {
      const { data, error } = await supabase
        .from('discount_coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCoupons(prev => prev.map(coupon => coupon.id === id ? data as DiscountCoupon : coupon));
      toast({
        title: "Sucesso",
        description: "Cupom atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cupom",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discount_coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCoupons(prev => prev.filter(coupon => coupon.id !== id));
      toast({
        title: "Sucesso",
        description: "Cupom excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir cupom",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return {
    coupons,
    loading,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    refetch: fetchCoupons
  };
}

export function useAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAffiliates(data as Affiliate[] || []);
    } catch (error) {
      console.error('Error fetching affiliates:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar afiliados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAffiliate = async (affiliateData: Omit<Affiliate, 'id' | 'created_at' | 'updated_at' | 'total_clicks' | 'total_conversions' | 'total_commission'>) => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .insert([affiliateData])
        .select()
        .single();

      if (error) throw error;
      
      setAffiliates(prev => [data as Affiliate, ...prev]);
      toast({
        title: "Sucesso",
        description: "Afiliado criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Error creating affiliate:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar afiliado",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAffiliate = async (id: string, updates: Partial<Affiliate>) => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAffiliates(prev => prev.map(affiliate => affiliate.id === id ? data as Affiliate : affiliate));
      toast({
        title: "Sucesso",
        description: "Afiliado atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Error updating affiliate:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar afiliado",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAffiliate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAffiliates(prev => prev.filter(affiliate => affiliate.id !== id));
      toast({
        title: "Sucesso",
        description: "Afiliado excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting affiliate:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir afiliado",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  return {
    affiliates,
    loading,
    createAffiliate,
    updateAffiliate,
    deleteAffiliate,
    refetch: fetchAffiliates
  };
}

export interface SaaSSettings {
  id: string;
  name: string;
  logo_url: string | null;
  sender_email: string | null;
  resend_api_key: string | null;
  stripe_publishable_key: string | null;
  stripe_secret_key: string | null;
  sms_provider_config: any | null;
  created_at: string;
  updated_at: string;
}

export function useSaaSSettings() {
  const [settings, setSettings] = useState<SaaSSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('saas_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data as SaaSSettings || null);
    } catch (error) {
      console.error('Error fetching SaaS settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações do SaaS",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SaaSSettings>) => {
    try {
      let data;
      if (settings) {
        const { data: updateData, error } = await supabase
          .from('saas_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        data = updateData;
      } else {
        const { data: insertData, error } = await supabase
          .from('saas_settings')
          .insert([updates])
          .select()
          .single();

        if (error) throw error;
        data = insertData;
      }

      setSettings(data as SaaSSettings);
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });
      console.info("OK: SaaS settings updated successfully");
      return data;
    } catch (error) {
      console.error('Error updating SaaS settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
}

export function useSecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data as SecuritySettings || null);
    } catch (error) {
      console.error('Error fetching security settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações de segurança",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SecuritySettings>) => {
    try {
      let data;
      if (settings) {
        const { data: updateData, error } = await supabase
          .from('security_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        data = updateData;
      } else {
        const { data: insertData, error } = await supabase
          .from('security_settings')
          .insert([updates])
          .select()
          .single();

        if (error) throw error;
        data = insertData;
      }

      setSettings(data as SecuritySettings);
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
}

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_monthly');

      if (error) throw error;
      setPlans(data as SubscriptionPlan[] || []);
      console.info("OK: Subscription plans loaded successfully");
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar planos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      
      setPlans(prev => [...prev, data as SubscriptionPlan]);
      toast({
        title: "Sucesso",
        description: "Plano criado com sucesso",
      });
      console.info("OK: Subscription plan created:", data.id);
      return data;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar plano",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePlan = async (id: string, updates: Partial<SubscriptionPlan>) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPlans(prev => prev.map(plan => plan.id === id ? data as SubscriptionPlan : plan));
      toast({
        title: "Sucesso",
        description: "Plano atualizado com sucesso",
      });
      console.info("OK: Subscription plan updated:", id);
      return data;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar plano",
        variant: "destructive",
      });
      throw error;
    }
  };

  const togglePlanStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return updatePlan(id, { status: newStatus as 'active' | 'inactive' });
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPlans(prev => prev.filter(plan => plan.id !== id));
      toast({
        title: "Sucesso",
        description: "Plano excluído com sucesso",
      });
      console.info("OK: Subscription plan deleted:", id);
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir plano",
        variant: "destructive",
      });
      throw error;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { className: "bg-green-100 text-green-800", text: "Ativo" };
      case 'inactive':
        return { className: "bg-gray-100 text-gray-800", text: "Inativo" };
      default:
        return { className: "bg-gray-100 text-gray-800", text: status };
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    createPlan,
    updatePlan,
    togglePlanStatus,
    deletePlan,
    formatCurrency,
    getStatusBadge,
    refetch: fetchPlans
  };
}