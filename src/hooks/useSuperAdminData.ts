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