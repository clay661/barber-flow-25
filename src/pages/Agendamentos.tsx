import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  Edit,
  X
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados mockados
const mockAppointments = [
  {
    id: 1,
    client: "João Silva",
    service: "Corte + Barba", 
    barber: "Carlos",
    date: "2024-08-25",
    time: "14:30",
    status: "Confirmado",
    price: 45
  },
  {
    id: 2,
    client: "Pedro Santos",
    service: "Corte Simples",
    barber: "Miguel", 
    date: "2024-08-25",
    time: "15:00",
    status: "Confirmado",
    price: 25
  },
  {
    id: 3,
    client: "Lucas Costa",
    service: "Barba",
    barber: "Carlos",
    date: "2024-08-25", 
    time: "15:30",
    status: "Aguardando",
    price: 20
  },
  {
    id: 4,
    client: "Carlos Oliveira",
    service: "Corte + Barba",
    barber: "Miguel",
    date: "2024-08-26",
    time: "09:00", 
    status: "Confirmado",
    price: 45
  }
];

const getStatusBadge = (status: string) => {
  const variants = {
    "Confirmado": "default",
    "Aguardando": "secondary", 
    "Concluído": "default",
    "Cancelado": "destructive"
  } as const;
  
  return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
};

export default function Agendamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredAppointments = mockAppointments.filter(appointment =>
    appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.barber.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(appointment => appointment.date === selectedDate);

  const totalAppointments = mockAppointments.length;
  const todayAppointments = mockAppointments.filter(a => a.date === selectedDate).length;
  const confirmedAppointments = mockAppointments.filter(a => a.status === "Confirmado").length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos da barbearia
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{todayAppointments}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">{totalAppointments}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">{confirmedAppointments}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              R$ {filteredAppointments.reduce((sum, a) => sum + a.price, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="p-4 sm:p-0 mb-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar agendamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] sm:w-auto">Cliente</TableHead>
                  <TableHead className="w-[120px] sm:w-auto hidden md:table-cell">Serviço</TableHead>
                  <TableHead className="w-[100px] sm:w-auto hidden lg:table-cell">Barbeiro</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Horário</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Status</TableHead>
                  <TableHead className="w-[80px] sm:w-auto hidden sm:table-cell">Valor</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{appointment.client}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-accent" />
                        <span className="text-sm">{appointment.service}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{appointment.barber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="font-medium hidden sm:table-cell text-sm">
                      R$ {appointment.price}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9">
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9">
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}