import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  created_at: string;
  tenants: {
    name: string;
    email: string;
    document_type: string;
    document_number: string;
  };
  subscription_plans: {
    name: string;
    price_monthly: number;
  };
}

export default function SuperAdminAssinaturas() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          tenants!inner(name, email, document_type, document_number),
          subscription_plans!inner(name, price_monthly)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.tenants.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.tenants.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      past_due: "bg-yellow-100 text-yellow-800",
      unpaid: "bg-orange-100 text-orange-800",
      incomplete: "bg-gray-100 text-gray-800"
    };
    
    const labels = {
      active: "Ativa",
      canceled: "Cancelada",
      past_due: "Em Atraso",
      unpaid: "Não Paga",
      incomplete: "Incompleta"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.incomplete}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const toggleSubscription = async (subscriptionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'canceled' : 'active';
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', subscriptionId);

      if (error) throw error;
      
      // Recarregar dados
      loadSubscriptions();
    } catch (error) {
      console.error('Erro ao alterar status da assinatura:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão de Assinaturas</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie todas as assinaturas do sistema
        </p>
      </div>

      {/* Barra de pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar assinaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de assinaturas */}
      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
          <CardDescription>
            Total: {filteredSubscriptions.length} assinaturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubscriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "Nenhuma assinatura encontrada" : "Nenhuma assinatura cadastrada"}
              </p>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{subscription.tenants.name}</h3>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Email: {subscription.tenants.email}
                    </p>
                    {subscription.tenants.document_number && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {subscription.tenants.document_type === 'cpf' ? 'CPF' : 'CNPJ'}: {subscription.tenants.document_number}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-1">
                      Plano: {subscription.subscription_plans.name} - R$ {subscription.subscription_plans.price_monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {subscription.current_period_end && (
                      <p className="text-xs text-muted-foreground">
                        Próximo vencimento: {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Histórico
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleSubscription(subscription.id, subscription.status)}
                      className={subscription.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {subscription.status === 'active' ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}