import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotificationSettings {
  id: string;
  provider: 'twilio' | 'ultramsg';
  api_key_sid: string;
  auth_token: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationHistory {
  id: string;
  appointment_id: string;
  client_phone: string;
  message: string;
  provider: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  provider_response: any;
  sent_at: string;
  created_at: string;
}

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSettings((data || []) as NotificationSettings[]);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações de notificação.',
        variant: 'destructive',
      });
    }
  };

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory((data || []) as NotificationHistory[]);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de notificações.',
        variant: 'destructive',
      });
    }
  };

  const createSettings = async (settingsData: Omit<NotificationSettings, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .insert([settingsData])
        .select()
        .single();

      if (error) throw error;

      setSettings(prev => [data as NotificationSettings, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Configurações de notificação salvas com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateSettings = async (id: string, settingsData: Partial<NotificationSettings>) => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .update(settingsData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSettings(prev => prev.map(setting => setting.id === id ? data as NotificationSettings : setting));
      toast({
        title: 'Sucesso',
        description: 'Configurações atualizadas com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as configurações.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteSettings = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notification_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSettings(prev => prev.filter(setting => setting.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Configurações removidas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao deletar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover as configurações.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const sendNotification = async (clientPhone: string, message: string, appointmentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          clientPhone,
          message,
          appointmentId
        }
      });

      if (error) throw error;

      // Recarregar histórico para mostrar a nova notificação
      await fetchHistory();

      return data;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a notificação.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchHistory()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    settings,
    history,
    loading,
    createSettings,
    updateSettings,
    deleteSettings,
    sendNotification,
    refetchSettings: fetchSettings,
    refetchHistory: fetchHistory,
  };
};