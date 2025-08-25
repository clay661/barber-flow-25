import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  CreditCard,
  Banknote,
  BarChart3
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados mockados - apenas relatórios do dia para Sub-Admin
const mockDailyFinances = {
  dailyRevenue: 680,
  dailyGrowth: 8.2,
  dailyTransactions: [
    { id: 1, time: "09:00", client: "João Silva", service: "Corte + Barba", amount: 45, method: "Dinheiro", employee: "Carlos" },
    { id: 2, time: "10:30", client: "Pedro Santos", service: "Corte Simples", amount: 25, method: "Cartão", employee: "Ana" },
    { id: 3, time: "14:00", client: "Lucas Costa", service: "Barba", amount: 20, method: "PIX", employee: "Carlos" },
    { id: 4, time: "15:30", client: "Roberto Lima", service: "Corte Degradê", amount: 35, method: "Cartão", employee: "Ana" },
  ]
};

const paymentMethodIcons = {
  "Dinheiro": Banknote,
  "Cartão": CreditCard,
  "PIX": DollarSign
};

export default function FinancasSubAdmin() {
  const totalTransactions = mockDailyFinances.dailyTransactions.length;
  const averageTicket = Math.round(
    mockDailyFinances.dailyTransactions.reduce((sum, t) => sum + t.amount, 0) / totalTransactions
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatório do Dia</h1>
        <p className="text-muted-foreground">
          Acompanhe a performance financeira de hoje
        </p>
      </div>

      {/* Cards de Resumo Financeiro do Dia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              R$ {mockDailyFinances.dailyRevenue.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-success">+{mockDailyFinances.dailyGrowth}%</span>
              <span className="text-muted-foreground">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Serviços realizados hoje</p>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">R$ {averageTicket}</div>
            <p className="text-xs text-muted-foreground">Por atendimento hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Transações do Dia */}
      <Card className="hover-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Atendimentos de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Hora</TableHead>
                  <TableHead className="w-[120px]">Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Serviço</TableHead>
                  <TableHead className="hidden sm:table-cell">Funcionário</TableHead>
                  <TableHead className="hidden sm:table-cell">Método</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDailyFinances.dailyTransactions.map((transaction) => {
                  const PaymentIcon = paymentMethodIcons[transaction.method as keyof typeof paymentMethodIcons];
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-sm">
                        {transaction.time}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{transaction.client}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{transaction.service}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{transaction.employee}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">{transaction.method}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-success text-sm">
                        R$ {transaction.amount}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Nota informativa */}
      <Card className="border-muted bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Relatório limitado aos dados do dia atual. Para relatórios completos, entre em contato com o administrador.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}