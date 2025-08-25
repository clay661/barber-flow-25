import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SuperAdmin {
  id: string;
  email: string;
  name: string;
}

export interface SuperAuthContextType {
  superAdmin: SuperAdmin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
}

const SuperAuthContext = createContext<SuperAuthContextType | undefined>(undefined);

export function useSuperAuth() {
  const context = useContext(SuperAuthContext);
  if (context === undefined) {
    throw new Error('useSuperAuth must be used within a SuperAuthProvider');
  }
  return context;
}

export function useSuperAuthState() {
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      // Verificar credenciais contra tabela super_admins
      const { data: adminData, error } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (error || !adminData) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      setSuperAdmin(adminData);
      // Armazenar no localStorage para persistência
      localStorage.setItem('super_admin_id', adminData.id);
      
      return { success: true };
    } catch (error) {
      console.error('Super Admin login error:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    setSuperAdmin(null);
    localStorage.removeItem('super_admin_id');
  };

  const checkAuthState = async () => {
    console.log('SuperAuth: Checking auth state...');
    const adminId = localStorage.getItem('super_admin_id');
    console.log('SuperAuth: Admin ID from localStorage:', adminId);
    
    if (adminId) {
      try {
        console.log('SuperAuth: Fetching admin data...');
        const { data: adminData, error } = await supabase
          .from('super_admins')
          .select('*')
          .eq('id', adminId)
          .single();

        console.log('SuperAuth: Query result:', { adminData, error });

        if (!error && adminData) {
          console.log('SuperAuth: Setting super admin');
          setSuperAdmin(adminData);
        } else {
          console.log('SuperAuth: Clearing localStorage due to error');
          localStorage.removeItem('super_admin_id');
        }
      } catch (error) {
        console.error('Super Admin auth check error:', error);
        localStorage.removeItem('super_admin_id');
      }
    }
    console.log('SuperAuth: Setting loading to false');
    setLoading(false);
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  return {
    superAdmin,
    loading,
    login,
    logout
  };
}

export { SuperAuthContext };