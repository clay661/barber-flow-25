
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  name: string;
  pro_email: string;
  role: 'ADMIN' | 'SUBADMIN' | 'FUNCIONARIO' | 'RECEPCIONISTA' | 'OUTRO';
  custom_role_name: string | null;
  status: 'ativo' | 'inativo';
  telefone: string | null;
  commission_type: 'percentage' | 'fixed';
  commission_value: number;
  created_at: string;
}

export interface AuthContextType {
  employee: Employee | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  checkAdminExists: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthState() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      console.log('Auth: Attempting secure login for:', email);
      
      const { data, error } = await supabase.functions.invoke('secure-login', {
        body: {
          email,
          password,
          userType: 'employee'
        }
      });

      if (error || !data.success) {
        console.log('Auth: Login failed:', error || data.error);
        return { success: false, error: data?.error || 'Credenciais inválidas' };
      }

      console.log('Auth: Login successful, user data:', data.user);
      setEmployee(data.user);
      localStorage.setItem('employee_id', data.user.id);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Auth: Attempting to create admin account');
      
      const { data, error } = await supabase
        .from('employees')
        .insert({
          name,
          pro_email: email,
          pro_password: password,
          role: 'ADMIN',
          status: 'ativo',
          commission_type: 'percentage',
          commission_value: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Register error:', error);
        return { success: false, error: 'Erro ao criar conta' };
      }

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Erro ao criar conta' };
    }
  };

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .eq('role', 'ADMIN')
        .limit(1);

      if (error) {
        console.error('Check admin exists error:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Check admin exists error:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log('Auth: Logging out');
    setEmployee(null);
    localStorage.removeItem('employee_id');
  };

  const refreshUser = async () => {
    const employeeId = localStorage.getItem('employee_id');
    if (employeeId) {
      await checkAuthState();
    }
  };

  const checkAuthState = async () => {
    console.log('Auth: Checking auth state...');
    const employeeId = localStorage.getItem('employee_id');
    const superAdminId = localStorage.getItem('super_admin_id');
    
    console.log('Auth: Employee ID from localStorage:', employeeId);
    console.log('Auth: Super Admin ID from localStorage:', superAdminId);
    
    if (superAdminId && !employeeId) {
      console.log('Auth: Super admin detected, skipping employee check');
      setLoading(false);
      return;
    }
    
    if (employeeId) {
      try {
        console.log('Auth: Fetching employee data...');
        const { data: employeeData, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', employeeId)
          .single();

        console.log('Auth: Query result:', { employeeData, error });

        if (!error && employeeData) {
          console.log('Auth: Setting employee with role:', employeeData.role);
          setEmployee(employeeData);
        } else {
          console.log('Auth: Clearing localStorage due to error');
          localStorage.removeItem('employee_id');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('employee_id');
      }
    }
    console.log('Auth: Setting loading to false');
    setLoading(false);
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  return {
    employee,
    loading,
    login,
    logout,
    refreshUser,
    register,
    checkAdminExists
  };
}

export { AuthContext };
