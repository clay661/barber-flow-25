import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Dados mockados para Sub-Admin
const mockSubAdminData = {
  todayAppointments: 12,
  confirmedAppointments: 8,
  pendingAppointments: 4,
  todayRevenue: 680,
  totalClients: 145,
  recentAppointments: [
    { id: 1, client: "João Silva", service: "Corte + Barba", time: "09:00", status: "CONFIRMADO", employee: "Carlos" },
    { id: 2, client: "Pedro Santos", service: "Corte Simples", time: "10:30", status: "PENDENTE", employee: "Ana" },
    { id: 3, client: "Lucas Costa", service: "Barba", time: "14:00", status: "CONFIRMADO", employee: "Carlos" },
    { id: 4, client: "Roberto Lima", service: "Corte Degradê", time: "15:30", status: "PENDENTE", employee: "Ana" },
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "CONFIRMADO":
      return <Badge variant="default" className="bg-success text-success-foreground">Confirmado</Badge>;
    case "PENDENTE":
      return <Badge variant="secondary">Pendente</Badge>;
    case "CANCELADO":
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function SubAdminDashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Gerente</h1>
        <p className="text-muted-foreground">
          Visão geral dos agendamentos e relatório do dia
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockSubAdminData.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Total do dia</p>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{mockSubAdminData.confirmedAppointments}</div>
            <p className="text-xs text-muted-foreground">Agendamentos confirmados</p>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mockSubAdminData.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">R$ {mockSubAdminData.todayRevenue}</div>
            <p className="text-xs text-muted-foreground">Faturamento do dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Agendamentos Recentes */}
      <Card className="hover-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Próximos Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSubAdminData.recentAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/50 gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{appointment.client}</span>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {appointment.service} • {appointment.employee} • {appointment.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Clientes */}
      <Card className="hover-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Resumo de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">{mockSubAdminData.totalClients}</div>
              <p className="text-sm text-muted-foreground">Total de clientes cadastrados</p>
            </div>
            <Users className="h-12 w-12 text-accent opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}