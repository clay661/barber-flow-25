
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  name: string;
  telefone: string | null;
  role: 'ADMIN' | 'SUBADMIN' | 'FUNCIONARIO' | 'RECEPCIONISTA' | 'OUTRO';
  custom_role_name?: string | null;
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
      console.log('Criando funcionário:', employeeData);
      
      const insertData = {
        name: employeeData.name,
        telefone: employeeData.telefone,
        role: employeeData.role,
        custom_role_name: employeeData.role === 'OUTRO' ? employeeData.custom_role_name : null,
        status: employeeData.status,
        commission_type: employeeData.commission_type,
        commission_value: employeeData.commission_value,
      };

      const { data, error } = await supabase
        .from('employees')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase:', error);
        
        // Tratar erros específicos
        if (error.code === '23505') {
          if (error.message.includes('unique_pro_email')) {
            throw new Error('Já existe um funcionário com credenciais similares. Tente um nome diferente.');
          }
        }
        throw error;
      }

      console.log('Funcionário criado:', data);
      setEmployees(prev => [data as Employee, ...prev]);
      
      toast({
        title: 'Sucesso!',
        description: 'Funcionário cadastrado com sucesso!',
      });
      
      // Retornar dados incluindo credenciais geradas
      return {
        ...data,
        credentials: {
          name: data.name,
          email: data.pro_email || '',
          password: 'Senha gerada automaticamente',
          phone: data.telefone || undefined,
        }
      };
    } catch (error: any) {
      console.error('Erro ao criar funcionário:', error);
      
      const errorMessage = error.message || 'Não foi possível cadastrar o funcionário.';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      // Limpar custom_role_name se role não for OUTRO
      const updateData = {
        name: employeeData.name,
        telefone: employeeData.telefone,
        role: employeeData.role,
        custom_role_name: employeeData.role === 'OUTRO' ? employeeData.custom_role_name : null,
        status: employeeData.status,
        commission_type: employeeData.commission_type,
        commission_value: employeeData.commission_value,
      };

      const { data, error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          if (error.message.includes('unique_pro_email')) {
            throw new Error('Já existe um funcionário com credenciais similares.');
          }
        }
        throw error;
      }

      setEmployees(prev => prev.map(emp => emp.id === id ? data as Employee : emp));
      toast({
        title: 'Sucesso',
        description: 'Funcionário atualizado com sucesso!',
      });
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar funcionário:', error);
      const errorMessage = error.message || 'Não foi possível atualizar o funcionário.';
      toast({
        title: 'Erro',
        description: errorMessage,
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
