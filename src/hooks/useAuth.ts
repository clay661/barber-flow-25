import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  name: string;
  role: 'ADMIN' | 'FUNCIONARIO' | 'SUBADMIN' | 'RECEPCIONISTA';
  pro_email: string;
  telefone?: string;
  status: string;
}

export interface AuthContextType {
  employee: Employee | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
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
      // Verify credentials against employees table
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('*')
        .eq('pro_email', email)
        .eq('pro_password', password)
        .eq('status', 'ativo')
        .single();

      if (error || !employeeData) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      setEmployee(employeeData);
      // Store in localStorage for persistence
      localStorage.setItem('employee_id', employeeData.id);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    setEmployee(null);
    localStorage.removeItem('employee_id');
  };

  const checkAuthState = async () => {
    const employeeId = localStorage.getItem('employee_id');
    if (employeeId) {
      try {
        const { data: employeeData, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', employeeId)
          .eq('status', 'ativo')
          .single();

        if (!error && employeeData) {
          setEmployee(employeeData);
        } else {
          localStorage.removeItem('employee_id');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('employee_id');
      }
    }
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
    isAdmin: employee?.role === 'ADMIN' || employee?.role === 'SUBADMIN'
  };
}

export { AuthContext };