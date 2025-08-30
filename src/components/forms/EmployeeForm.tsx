
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Employee } from '@/hooks/useEmployees';

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Employee, 'id' | 'created_at' | 'pro_email' | 'pro_password'>) => Promise<any>;
  employee?: Employee | null;
  loading?: boolean;
}

export function EmployeeForm({ open, onOpenChange, onSubmit, employee, loading = false }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    telefone: '',
    role: 'FUNCIONARIO' as Employee['role'],
    custom_role_name: '',
    status: 'ativo' as 'ativo' | 'inativo',
    commission_type: 'percentage' as 'percentage' | 'fixed',
    commission_value: '0',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        telefone: employee.telefone || '',
        role: employee.role,
        custom_role_name: employee.custom_role_name || '',
        status: employee.status,
        commission_type: employee.commission_type,
        commission_value: employee.commission_value.toString(),
      });
    } else {
      setFormData({
        name: '',
        telefone: '',
        role: 'FUNCIONARIO',
        custom_role_name: '',
        status: 'ativo',
        commission_type: 'percentage',
        commission_value: '0',
      });
    }
    setErrors({});
  }, [employee, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (formData.role === 'OUTRO' && !formData.custom_role_name.trim()) {
      newErrors.custom_role_name = 'Nome do cargo personalizado é obrigatório';
    }

    const commissionValue = parseFloat(formData.commission_value);
    if (isNaN(commissionValue) || commissionValue < 0) {
      newErrors.commission_value = 'Valor da comissão deve ser um número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        telefone: formData.telefone.trim() || null,
        role: formData.role,
        custom_role_name: formData.role === 'OUTRO' ? formData.custom_role_name.trim() : null,
        status: formData.status,
        commission_type: formData.commission_type,
        commission_value: parseFloat(formData.commission_value),
      };

      console.log('Enviando dados do formulário:', submitData);
      
      const result = await onSubmit(submitData);
      console.log('Resultado da submissão:', result);
      
      if (result) {
        setErrors({});
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Erro no formulário:', error);
      const errorMessage = error.message || 'Erro ao salvar funcionário';
      
      if (errorMessage.includes('pro_email') || errorMessage.includes('credenciais similares')) {
        setErrors({ name: 'Já existe um funcionário com esse nome. Tente um nome diferente.' });
      } else {
        setErrors({ general: errorMessage });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
          </DialogTitle>
          <DialogDescription>
            {employee ? 'Atualize as informações do funcionário.' : 'Cadastre um novo funcionário no sistema. Login e senha serão gerados automaticamente.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome completo"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              className={errors.telefone ? 'border-red-500' : ''}
            />
            {errors.telefone && <p className="text-sm text-red-600">{errors.telefone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as Employee['role'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                <SelectItem value="RECEPCIONISTA">Recepcionista</SelectItem>
                <SelectItem value="SUBADMIN">Sub-administrador</SelectItem>
                <SelectItem value="OUTRO">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === 'OUTRO' && (
            <div className="space-y-2">
              <Label htmlFor="custom_role_name">Nome do Cargo *</Label>
              <Input
                id="custom_role_name"
                value={formData.custom_role_name}
                onChange={(e) => setFormData({ ...formData, custom_role_name: e.target.value })}
                placeholder="Digite o nome do cargo"
                className={errors.custom_role_name ? 'border-red-500' : ''}
              />
              {errors.custom_role_name && <p className="text-sm text-red-600">{errors.custom_role_name}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission_type">Tipo de Comissão</Label>
              <Select
                value={formData.commission_type}
                onValueChange={(value) => setFormData({ ...formData, commission_type: value as 'percentage' | 'fixed' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentual (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission_value">
                Valor da Comissão {formData.commission_type === 'percentage' ? '(%)' : '(R$)'}
              </Label>
              <Input
                id="commission_value"
                type="number"
                step="0.01"
                value={formData.commission_value}
                onChange={(e) => setFormData({ ...formData, commission_value: e.target.value })}
                placeholder="0"
                min="0"
                className={errors.commission_value ? 'border-red-500' : ''}
              />
              {errors.commission_value && <p className="text-sm text-red-600">{errors.commission_value}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'ativo' | 'inativo' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (employee ? 'Atualizar' : 'Cadastrar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
