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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Finanças</h1>
          <p className="text-muted-foreground">
            Acompanhe a performance financeira da empresa
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant={selectedPeriod === "diario" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("diario")}
            className="hover-glow flex-1 sm:flex-none"
          >
            Dia
          </Button>
          <Button 
            variant={selectedPeriod === "semanal" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("semanal")}
            className="hover-glow flex-1 sm:flex-none"
          >
            Semana
          </Button>
          <Button 
            variant={selectedPeriod === "mensal" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("mensal")}
            className="hover-glow flex-1 sm:flex-none"
          >
            Mês
          </Button>
        </div>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-1 sm:col-span-2 lg:col-span-2 hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Total ({selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              R$ {getRevenueByPeriod().toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-success">+{mockFinances.monthlyGrowth}%</span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Total de vendas</p>
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
            <p className="text-xs text-muted-foreground">Por atendimento</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita (Placeholder) */}
      <Card className="hover-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Receita dos Últimos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-accent mx-auto mb-2 animate-glow-pulse" />
              <p className="text-muted-foreground">Gráfico de receita semanal</p>
              <p className="text-sm text-muted-foreground mt-1">Implementar com biblioteca de gráficos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimas Transações */}
      <Card className="hover-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Últimas Transações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] sm:w-auto">Data</TableHead>
                  <TableHead className="w-[120px] sm:w-auto">Cliente</TableHead>
                  <TableHead className="w-[120px] sm:w-auto hidden md:table-cell">Serviço</TableHead>
                  <TableHead className="w-[100px] sm:w-auto hidden sm:table-cell">Método</TableHead>
                  <TableHead className="text-right w-[80px] sm:w-auto">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFinances.transactions.map((transaction) => {
                  const PaymentIcon = paymentMethodIcons[transaction.method as keyof typeof paymentMethodIcons];
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-xs sm:text-sm">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{transaction.client}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{transaction.service}</TableCell>
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
    </div>
  );
}