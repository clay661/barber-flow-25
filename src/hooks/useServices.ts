import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Service {
  id: string;
  name: string;
  category: string;
  duration_minutes: number;
  price: number;
  status: 'ativo' | 'inativo';
  created_at: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices((data || []) as Service[]);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;

      setServices(prev => [data as Service, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Serviço cadastrado com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o serviço.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => prev.map(service => service.id === id ? data as Service : service));
      toast({
        title: 'Sucesso',
        description: 'Serviço atualizado com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o serviço.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Serviço removido com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o serviço.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices,
  };
};