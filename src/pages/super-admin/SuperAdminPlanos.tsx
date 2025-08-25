import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Check, Settings } from "lucide-react";
import { useSubscriptionPlans } from "@/hooks/useSuperAdminData";
import { useState } from "react";

export default function SuperAdminPlanos() {
  const { plans, loading, togglePlanStatus, deletePlan, formatCurrency, getStatusBadge } = useSubscriptionPlans();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await togglePlanStatus(id, currentStatus);
      console.info("OK: Plan status toggled successfully");
    } catch (error) {
      console.error("Error toggling plan status:", error);
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o plano "${name}"?`)) {
      try {
        await deletePlan(id);
        console.info("OK: Plan deleted successfully");
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const renderFeatures = (features: any) => {
    if (!features || typeof features !== 'object') return [];
    
    const featureList = [];
    if (features.employees) featureList.push(`Até ${features.employees} funcionários`);
    if (features.clients) featureList.push(`${features.clients} clientes`);
    if (features.unlimited_appointments) featureList.push('Agendamentos ilimitados');
    if (features.reports) featureList.push('Relatórios avançados');
    if (features.support) featureList.push(features.support);
    if (features.api) featureList.push('API personalizada');
    
    return featureList;
  };

  if (loading) {
    return <div className="p-6">Carregando planos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos e Cobrança</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os planos de assinatura e configurações de cobrança
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Lista de planos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => {
          const statusBadge = getStatusBadge(plan.status);
          const features = renderFeatures(plan.features);
          const isPopular = index === 1; // Segundo plano como mais popular
          
          return (
            <Card key={plan.id} className={`relative ${isPopular ? 'border-primary' : ''}`}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  <Badge className={statusBadge.className}>
                    {statusBadge.text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">{formatCurrency(plan.price_monthly)}</div>
                  <div className="text-sm text-muted-foreground">por mês</div>
                  {plan.price_yearly && (
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(plan.price_yearly)} por ano
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status do Plano</span>
                    <Switch
                      checked={plan.status === 'active'}
                      onCheckedChange={() => handleToggleStatus(plan.id, plan.status)}
                    />
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Plano
                  </Button>
                  
                  {plan.status === 'inactive' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Plano
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {plans.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhum plano cadastrado ainda.
          </div>
        )}
      </div>

      {/* Configurações de cobrança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Cobrança
          </CardTitle>
          <CardDescription>
            Configure as opções de cobrança e integração com Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Integração Stripe</h3>
                <p className="text-sm text-muted-foreground">
                  Configurar chaves da API do Stripe
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Período de Trial</h3>
                <p className="text-sm text-muted-foreground">
                  Definir período de teste gratuito: 7 dias
                </p>
              </div>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Taxas e Impostos</h3>
                <p className="text-sm text-muted-foreground">
                  Configurar taxas adicionais
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}