import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SalonSettings {
  id: string;
  name: string;
  logo_url: string | null;
  banner_url: string | null;
  public_link: string;
  created_at: string;
  updated_at: string;
}

export function useSalonSettings() {
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('salon_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching salon settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Omit<SalonSettings, 'id' | 'created_at' | 'updated_at' | 'public_link'>>) => {
    try {
      const { data, error } = await supabase
        .from('salon_settings')
        .update(updates)
        .eq('id', settings?.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      return { success: true };
    } catch (error) {
      console.error('Error updating salon settings:', error);
      return { success: false, error };
    }
  };

  const uploadImage = async (file: File, type: 'logo' | 'banner') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('salon-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('salon-images')
        .getPublicUrl(fileName);

      // Update settings with new image URL
      const updateField = type === 'logo' ? 'logo_url' : 'banner_url';
      await updateSettings({ [updateField]: publicUrl });

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    uploadImage,
    refetch: fetchSettings
  };
}