import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Calendar, 
  Users,
  Clock,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

// Dados mockados para demonstração
const mockReceptionistData = {
  appointmentsToday: 12,
  totalClients: 347,
  pendingAppointments: 3,
  confirmedToday: 9,
  todayAppointments: [
    { id: 1, client: "João Silva", service: "Corte + Barba", time: "14:30", barber: "Carlos", status: "CONFIRMADO" },
    { id: 2, client: "Pedro Santos", service: "Corte Simples", time: "15:00", barber: "Miguel", status: "PENDENTE" },
    { id: 3, client: "Lucas Costa", service: "Barba", time: "15:30", barber: "Carlos", status: "CONFIRMADO" },
  ]
};

export function ReceptionistDashboard() {
  const { employee } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Recepção</h1>
          <p className="text-muted-foreground">
            Olá, {employee?.name}! Gerencie os agendamentos e clientes
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Cards de Resumo da Recepção */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardCard
          title="Agendamentos Hoje"
          value={mockReceptionistData.appointmentsToday}
          icon={Calendar}
          description="Total do dia"
        />
        
        <DashboardCard
          title="Clientes Cadastrados"
          value={mockReceptionistData.totalClients}
          icon={Users}
          description="Base de clientes"
          trend={{ value: 12, isPositive: true }}
        />

        <DashboardCard
          title="Pendentes"
          value={mockReceptionistData.pendingAppointments}
          icon={Clock}
          description="Aguardando confirmação"
        />
        
        <DashboardCard
          title="Confirmados Hoje"
          value={mockReceptionistData.confirmedToday}
          icon={CheckCircle}
          description="Agendamentos confirmados"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Agendamentos de Hoje */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Agendamentos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockReceptionistData.todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{appointment.client}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-accent">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.barber}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      appointment.status === 'CONFIRMADO' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
                <h4 className="font-medium text-foreground mb-2">Novo Agendamento</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Crie rapidamente um novo agendamento para qualquer funcionário
                </p>
                <button className="w-full bg-accent text-accent-foreground rounded-md py-2 text-sm font-medium hover:bg-accent/90 transition-colors">
                  Criar Agendamento
                </button>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                <h4 className="font-medium text-foreground mb-2">Buscar Cliente</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Encontre rapidamente informações de clientes
                </p>
                <button className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                  Buscar Cliente
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}