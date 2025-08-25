import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
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

// Dados mockados
const mockFinances = {
  monthlyRevenue: 8450,
  dailyRevenue: 290,
  weeklyRevenue: 1850,
  monthlyGrowth: 12.5,
  transactions: [
    { id: 1, date: "2024-08-25", client: "João Silva", service: "Corte + Barba", amount: 45, method: "Dinheiro" },
    { id: 2, date: "2024-08-25", client: "Pedro Santos", service: "Corte Simples", amount: 25, method: "Cartão" },
    { id: 3, date: "2024-08-24", client: "Lucas Costa", service: "Barba", amount: 20, method: "PIX" },
    { id: 4, date: "2024-08-24", client: "Carlos Oliveira", service: "Corte + Barba", amount: 45, method: "Cartão" },
    { id: 5, date: "2024-08-23", client: "Roberto Lima", service: "Corte Degradê", amount: 35, method: "Dinheiro" },
  ]
};

const paymentMethodIcons = {
  "Dinheiro": Banknote,
  "Cartão": CreditCard,
  "PIX": DollarSign
};

export default function Financas() {
  const [selectedPeriod, setSelectedPeriod] = useState("mensal");

  const getRevenueByPeriod = () => {
    switch (selectedPeriod) {
      case "diario": return mockFinances.dailyRevenue;
      case "semanal": return mockFinances.weeklyRevenue;
      case "mensal": return mockFinances.monthlyRevenue;
      default: return mockFinances.monthlyRevenue;
    }
  };

  const totalTransactions = mockFinances.transactions.length;
  const averageTicket = Math.round(
    mockFinances.transactions.reduce((sum, t) => sum + t.amount, 0) / totalTransactions
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finanças</h1>
          <p className="text-muted-foreground">
            Acompanhe a performance financeira da barbearia
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === "diario" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("diario")}
          >
            Dia
          </Button>
          <Button 
            variant={selectedPeriod === "semanal" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("semanal")}
          >
            Semana
          </Button>
          <Button 
            variant={selectedPeriod === "mensal" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("mensal")}
          >
            Mês
          </Button>
        </div>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Total ({selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              R$ {getRevenueByPeriod().toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-success">+{mockFinances.monthlyGrowth}%</span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Total de vendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">R$ {averageTicket}</div>
            <p className="text-xs text-muted-foreground">Por atendimento</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Receita dos Últimos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-accent mx-auto mb-2" />
              <p className="text-muted-foreground">Gráfico de receita semanal</p>
              <p className="text-sm text-muted-foreground mt-1">Implementar com biblioteca de gráficos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimas Transações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Últimas Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFinances.transactions.map((transaction) => {
                  const PaymentIcon = paymentMethodIcons[transaction.method as keyof typeof paymentMethodIcons];
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">{transaction.client}</TableCell>
                      <TableCell>{transaction.service}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">{transaction.method}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-success">
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
    </div>
  );
}