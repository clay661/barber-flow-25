import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Calendar, 
  Scissors, 
  DollarSign,
  Clock,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

// Dados mockados para demonstração - na implementação real, filtrar por funcionário
const mockEmployeeData = {
  myAppointmentsToday: 5,
  servicesCompleted: 8,
  monthlyCommission: 1250,
  myClients: 42,
  myAppointments: [
    { id: 1, client: "João Silva", service: "Corte + Barba", time: "14:30" },
    { id: 2, client: "Pedro Santos", service: "Corte Simples", time: "15:00" },
    { id: 3, client: "Lucas Costa", service: "Barba", time: "15:30" },
  ]
};

export function EmployeeDashboard() {
  const { employee } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Dashboard</h1>
          <p className="text-muted-foreground">
            Olá, {employee?.name}! Aqui está o resumo dos seus atendimentos
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

      {/* Cards de Resumo do Funcionário */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardCard
          title="Meus Agendamentos Hoje"
          value={mockEmployeeData.myAppointmentsToday}
          icon={Calendar}
          description="Horários marcados"
        />
        
        <DashboardCard
          title="Serviços Realizados"
          value={mockEmployeeData.servicesCompleted}
          icon={Scissors}
          description="Concluídos hoje"
          trend={{ value: 3, isPositive: true }}
        />

        <DashboardCard
          title="Meus Clientes"
          value={mockEmployeeData.myClients}
          icon={Users}
          description="Clientes atendidos"
          trend={{ value: 5, isPositive: true }}
        />
        
        <DashboardCard
          title="Comissão do Mês"
          value={`R$ ${mockEmployeeData.monthlyCommission.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          description={employee?.commission_type === 'percentage' ? `${employee.commission_value}% dos serviços` : 'Valor fixo'}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Meus Próximos Agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Meus Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEmployeeData.myAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{appointment.client}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-accent">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Comissão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Resumo da Comissão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-accent/10">
                <span className="text-sm text-muted-foreground">Tipo de Comissão:</span>
                <span className="font-medium">
                  {employee?.commission_type === 'percentage' 
                    ? `${employee.commission_value}% por serviço` 
                    : `R$ ${employee?.commission_value} fixo`}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-success/10">
                <span className="text-sm text-muted-foreground">Este Mês:</span>
                <span className="font-bold text-success">R$ {mockEmployeeData.monthlyCommission.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Serviços Realizados:</span>
                <span className="font-medium">{mockEmployeeData.servicesCompleted}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}