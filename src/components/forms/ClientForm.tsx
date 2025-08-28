
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Client } from '@/hooks/useClients';

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Client, 'id' | 'created_at' | 'total_visits'>) => Promise<void>;
  client?: Client | null;
  loading?: boolean;
}

export function ClientForm({ open, onOpenChange, onSubmit, client, loading = false }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    telefone: '',
    email: '',
    status: 'ativo' as 'ativo' | 'inativo',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        telefone: client.telefone || '',
        email: client.email || '',
        status: client.status,
      });
    } else {
      setFormData({
        name: '',
        telefone: '',
        email: '',
        status: 'ativo',
      });
    }
    setErrors({});
  }, [client, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone) && !/^\d{10,11}$/.test(formData.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Formato de telefone inválido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
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
        email: formData.email.trim() || null,
        status: formData.status,
      };

      await onSubmit(submitData);
      setErrors({});
      onOpenChange(false);
    } catch (error: any) {
      // Preservar dados em caso de erro
      const errorMessage = error.message || 'Erro ao salvar cliente';
      
      if (errorMessage.includes('unique_client_email')) {
        setErrors({ email: 'Este e-mail já está cadastrado' });
      } else if (errorMessage.includes('unique_client_phone')) {
        setErrors({ telefone: 'Este telefone já está cadastrado' });
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
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {client ? 'Atualize as informações do cliente.' : 'Cadastre um novo cliente no sistema.'}
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
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="cliente@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
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
              {loading ? 'Salvando...' : (client ? 'Atualizar' : 'Cadastrar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
