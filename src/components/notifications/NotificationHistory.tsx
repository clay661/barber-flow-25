import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NotificationHistory as NotificationHistoryType } from '@/hooks/useNotifications';
import { MessageSquare, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

interface NotificationHistoryProps {
  history: NotificationHistoryType[];
  loading: boolean;
}

export function NotificationHistory({ history, loading }: NotificationHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Loader className="h-4 w-4 text-muted-foreground animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      delivered: 'default',
      failed: 'destructive',
      pending: 'secondary'
    } as const;

    const labels = {
      sent: 'Enviado',
      delivered: 'Entregue',
      failed: 'Falhou',
      pending: 'Pendente'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getProviderBadge = (provider: string) => {
    const providerNames = {
      twilio: 'Twilio (SMS)',
      ultramsg: 'UltraMsg (WhatsApp)',
      none: 'Não configurado'
    } as const;

    return (
      <Badge variant="outline">
        {providerNames[provider as keyof typeof providerNames] || provider}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Histórico de Notificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando histórico...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma notificação enviada ainda.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="hidden md:table-cell">Provedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Mensagem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">
                            {new Date(notification.sent_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(notification.sent_at).toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{notification.client_phone}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getProviderBadge(notification.provider)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(notification.status)}
                        {getStatusBadge(notification.status)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="max-w-xs truncate text-sm">
                        {notification.message}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}