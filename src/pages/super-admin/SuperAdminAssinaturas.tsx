import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { useSubscriptionsManagement } from "@/hooks/useSubscriptionsManagement";
import { PaymentHistoryModal } from "@/components/super-admin/PaymentHistoryModal";
import { useState } from "react";

export default function SuperAdminAssinaturas() {
  const {
    subscriptions,
    loading,
    searchTerm,
    setSearchTerm,
    toggleSubscriptionStatus,
    fetchPaymentHistory,
    getStatusBadge,
    formatDate,
    formatCurrency,
    getActiveSubscriptionsCount
  } = useSubscriptionsManagement();

  const [historyModal, setHistoryModal] = useState<{
    isOpen: boolean;
    subscriptionId: string;
    tenantName: string;
  }>({
    isOpen: false,
    subscriptionId: '',
    tenantName: ''
  });

  const handleToggleStatus = async (subscription) => {
    if (confirm(`Tem certeza que deseja ${subscription.status === 'active' ? 'cancelar' : 'reativar'} a assinatura de "${subscription.tenant.name}"?`)) {
      await toggleSubscriptionStatus(subscription.id, subscription.status);
    }
  };

  const handleViewHistory = (subscription) => {
    setHistoryModal({
      isOpen: true,
      subscriptionId: subscription.id,
      tenantName: subscription.tenant.name
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Assinaturas</h1>
          <p className="text-muted-foreground mt-2">Carregando assinaturas...</p>
        </div>
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

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar assinaturas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
          <CardDescription>
            Total: {getActiveSubscriptionsCount()} assinaturas ativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => {
                const statusBadge = getStatusBadge(subscription.status);
                return (
                  <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{subscription.tenant.name}</h3>
                        <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email: {subscription.tenant.email}
                      </p>
                      {subscription.tenant.document_number && (
                        <p className="text-sm text-muted-foreground mb-1">
                          {subscription.tenant.document_type?.toUpperCase()}: {subscription.tenant.document_number}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mb-1">
                        Plano: {subscription.plan.name} - {formatCurrency(subscription.plan.price_monthly)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subscription.status === 'active' 
                          ? `Próximo vencimento: ${formatDate(subscription.current_period_end)}`
                          : `Cancelada em: ${formatDate(subscription.updated_at)}`
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewHistory(subscription)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Histórico
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={subscription.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        onClick={() => handleToggleStatus(subscription)}
                      >
                        {subscription.status === 'active' ? (
                          <>
                            <ToggleRight className="h-4 w-4 mr-1" />
                            Cancelar
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-1" />
                            Reativar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'Nenhuma assinatura encontrada.' : 'Nenhuma assinatura cadastrada ainda.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PaymentHistoryModal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ isOpen: false, subscriptionId: '', tenantName: '' })}
        subscriptionId={historyModal.subscriptionId}
        tenantName={historyModal.tenantName}
        fetchPaymentHistory={fetchPaymentHistory}
      />
    </div>
  );
}