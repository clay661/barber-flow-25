
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionPlan } from "@/hooks/useSuperAdminData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: SubscriptionPlan | null;
  onSuccess: () => void;
}

export function PlanEditModal({ isOpen, onClose, plan, onSuccess }: PlanEditModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_monthly: 0,
    price_yearly: 0,
    trial_days: 7,
    features: {
      employees: 5,
      clients: "unlimited",
      unlimited_appointments: true,
      reports: true,
      support: "Email",
      api: false,
    },
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || "",
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly || 0,
        trial_days: plan.trial_days,
        features: plan.features || {
          employees: 5,
          clients: "unlimited",
          unlimited_appointments: true,
          reports: true,
          support: "Email",
          api: false,
        },
        status: plan.status,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price_monthly: 0,
        price_yearly: 0,
        trial_days: 7,
        features: {
          employees: 5,
          clients: "unlimited",
          unlimited_appointments: true,
          reports: true,
          support: "Email",
          api: false,
        },
        status: "active",
      });
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('manage-subscription-plans', {
        body: {
          action: plan ? 'update' : 'create',
          planData: plan ? { planId: plan.id, updates: formData } : formData,
        },
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Plano ${plan ? 'atualizado' : 'criado'} com sucesso!`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || `Erro ao ${plan ? 'atualizar' : 'criar'} plano`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: value,
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? 'Editar Plano' : 'Criar Novo Plano'}</DialogTitle>
          <DialogDescription>
            {plan ? 'Faça as alterações necessárias no plano' : 'Preencha os dados do novo plano'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                  }
                />
                <span>{formData.status === 'active' ? 'Ativo' : 'Inativo'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_monthly">Preço Mensal (R$)</Label>
              <Input
                id="price_monthly"
                type="number"
                step="0.01"
                value={formData.price_monthly}
                onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price_yearly">Preço Anual (R$)</Label>
              <Input
                id="price_yearly"
                type="number"
                step="0.01"
                value={formData.price_yearly}
                onChange={(e) => setFormData({ ...formData, price_yearly: parseFloat(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trial_days">Dias de Trial</Label>
              <Input
                id="trial_days"
                type="number"
                value={formData.trial_days}
                onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Recursos do Plano</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employees">Funcionários</Label>
                <Input
                  id="employees"
                  type="number"
                  value={formData.features.employees}
                  onChange={(e) => handleFeatureChange('employees', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clients">Clientes</Label>
                <Input
                  id="clients"
                  value={formData.features.clients}
                  onChange={(e) => handleFeatureChange('clients', e.target.value)}
                  placeholder="unlimited ou número"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="unlimited_appointments">Agendamentos Ilimitados</Label>
                <Switch
                  checked={formData.features.unlimited_appointments}
                  onCheckedChange={(checked) => handleFeatureChange('unlimited_appointments', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reports">Relatórios Avançados</Label>
                <Switch
                  checked={formData.features.reports}
                  onCheckedChange={(checked) => handleFeatureChange('reports', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="api">API Personalizada</Label>
                <Switch
                  checked={formData.features.api}
                  onCheckedChange={(checked) => handleFeatureChange('api', checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="support">Tipo de Suporte</Label>
              <Input
                id="support"
                value={formData.features.support}
                onChange={(e) => handleFeatureChange('support', e.target.value)}
                placeholder="Email, Chat, Telefone"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : plan ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
