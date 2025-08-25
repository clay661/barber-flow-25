import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  name: string;
  telefone: string | null;
  email: string | null;
  status: 'ativo' | 'inativo';
  total_visits: number;
  created_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients((data || []) as Client[]);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os clientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'total_visits'>) => {
    try {
      const dataWithDefaults = {
        ...clientData,
        total_visits: 0,
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([dataWithDefaults])
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [data as Client, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Cliente cadastrado com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o cliente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => client.id === id ? data as Client : client));
      toast({
        title: 'Sucesso',
        description: 'Cliente atualizado com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o cliente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Cliente removido com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o cliente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};