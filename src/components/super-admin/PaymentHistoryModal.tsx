import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentHistoryItem } from "@/hooks/useSubscriptionsManagement";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
  tenantName: string;
  fetchPaymentHistory: (subscriptionId: string) => Promise<PaymentHistoryItem[]>;
}

export function PaymentHistoryModal({ 
  isOpen, 
  onClose, 
  subscriptionId,
  tenantName,
  fetchPaymentHistory
}: PaymentHistoryModalProps) {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && subscriptionId) {
      loadPaymentHistory();
    }
  }, [isOpen, subscriptionId]);

  const loadPaymentHistory = async () => {
    setLoading(true);
    try {
      const history = await fetchPaymentHistory(subscriptionId);
      setPayments(history);
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return { className: "bg-green-100 text-green-800", text: "Pago" };
      case 'pending':
        return { className: "bg-yellow-100 text-yellow-800", text: "Pendente" };
      case 'failed':
        return { className: "bg-red-100 text-red-800", text: "Falhou" };
      default:
        return { className: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100); // Assumindo que valores estão em centavos
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Pagamentos</DialogTitle>
          <DialogDescription>
            Histórico de pagamentos da empresa: {tenantName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : payments.length > 0 ? (
            payments.map((payment) => {
              const statusBadge = getStatusBadge(payment.status);
              return (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Data: {formatDate(payment.payment_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Moeda: {payment.currency}
                    </p>
                    {payment.stripe_payment_intent_id && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {payment.stripe_payment_intent_id}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}