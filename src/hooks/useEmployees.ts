import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  name: string;
  telefone: string | null;
  role: 'ADMIN' | 'SUBADMIN' | 'FUNCIONARIO' | 'RECEPCIONISTA';
  status: 'ativo' | 'inativo';
  pro_email: string | null;
  pro_password: string | null;
  commission_type: 'percentage' | 'fixed';
  commission_value: number;
  created_at: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees((data || []) as Employee[]);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os funcionários.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'pro_email' | 'pro_password'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (error) throw error;

      setEmployees(prev => [data as Employee, ...prev]);
      
      // Retornar dados incluindo credenciais geradas
      return {
        ...data,
        credentials: {
          name: data.name,
          email: data.pro_email || '',
          password: data.pro_password || '',
          phone: data.telefone || undefined,
        }
      };
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o funcionário.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEmployees(prev => prev.map(emp => emp.id === id ? data as Employee : emp));
      toast({
        title: 'Sucesso',
        description: 'Funcionário atualizado com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o funcionário.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Funcionário removido com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o funcionário.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  };
};