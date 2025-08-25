import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  name: string;
  role: 'ADMIN' | 'FUNCIONARIO' | 'SUBADMIN' | 'RECEPCIONISTA';
  pro_email: string;
  telefone?: string;
  status: string;
  commission_type?: string;
  commission_value?: number;
}

export interface AuthContextType {
  employee: Employee | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  checkAdminExists: () => Promise<boolean>;
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
      // Verificar se é super admin primeiro
      if (email === 'luizasbs70@gmail.com' && password === '10luiz10') {
        // Redirecionar para o painel super admin
        window.location.href = '/super-admin';
        return { success: true };
      }

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

  const register = async (name: string, email: string, password: string) => {
    try {
      // First check if an admin already exists
      const adminExists = await checkAdminExists();
      if (adminExists) {
        return { success: false, error: 'Já existe um administrador no sistema' };
      }

      // Create the admin employee
      const { data: newEmployee, error } = await supabase
        .from('employees')
        .insert({
          name,
          pro_email: email,
          pro_password: password,
          role: 'ADMIN',
          status: 'ativo'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: 'Este e-mail já está em uso' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Erro ao criar administrador' };
    }
  };

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .eq('role', 'ADMIN')
        .eq('status', 'ativo')
        .limit(1);

      if (error) {
        console.error('Error checking admin:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking admin:', error);
      return false;
    }
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
    register,
    checkAdminExists,
    isAdmin: employee?.role === 'ADMIN' || employee?.role === 'SUBADMIN'
  };
}

export { AuthContext };