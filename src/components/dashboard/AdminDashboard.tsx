import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Users, 
  Calendar, 
  Scissors, 
  DollarSign,
  TrendingUp,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dados mockados para demonstração
const mockData = {
  clientesToday: 12,
  totalClients: 347,
  appointmentsToday: 8,
  servicesCompleted: 15,
  monthlyRevenue: 8450,
  recentAppointments: [
    { id: 1, client: "João Silva", service: "Corte + Barba", time: "14:30", barber: "Carlos" },
    { id: 2, client: "Pedro Santos", service: "Corte Simples", time: "15:00", barber: "Miguel" },
    { id: 3, client: "Lucas Costa", service: "Barba", time: "15:30", barber: "Carlos" },
  ]
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral completa da empresa
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

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardCard
          title="Clientes Cadastrados"
          value={mockData.totalClients}
          icon={Users}
          description="Total de clientes"
          trend={{ value: 12, isPositive: true }}
        />
        
        <DashboardCard
          title="Agendamentos Hoje"
          value={mockData.appointmentsToday}
          icon={Calendar}
          description="Horários marcados"
        />
        
        <DashboardCard
          title="Serviços Realizados"
          value={mockData.servicesCompleted}
          icon={Scissors}
          description="Concluídos hoje"
          trend={{ value: 8, isPositive: true }}
        />
        
        <DashboardCard
          title="Receita do Mês"
          value={`R$ ${mockData.monthlyRevenue.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          description="Faturamento mensal"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Próximos Agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{appointment.client}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-accent">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.barber}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Receita (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Receita Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-accent mx-auto mb-2" />
                <p className="text-muted-foreground">Gráfico de receita</p>
                <p className="text-sm text-muted-foreground mt-1">Implementar com dados reais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}