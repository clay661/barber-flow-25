import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

export default function SuperAdminFinanceiro() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios Financeiros</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe a receita e exporte relatórios
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Resumo financeiro */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Este Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4.560,00</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Anual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 48.720,00</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +28% vs ano anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Média por Cliente</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 138,46</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receita por mês */}
      <Card>
        <CardHeader>
          <CardTitle>Receita Mensal - 2025</CardTitle>
          <CardDescription>
            Evolução da receita ao longo do ano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="text-xs text-muted-foreground">Jan</div>
              <div className="text-xs text-muted-foreground">Fev</div>
              <div className="text-xs text-muted-foreground">Mar</div>
              <div className="text-xs text-muted-foreground">Abr</div>
              <div className="text-xs text-muted-foreground">Mai</div>
              <div className="text-xs text-muted-foreground">Jun</div>
              <div className="text-xs text-muted-foreground">Jul</div>
              <div className="text-xs text-muted-foreground">Ago</div>
              <div className="text-xs text-muted-foreground">Set</div>
              <div className="text-xs text-muted-foreground">Out</div>
              <div className="text-xs text-muted-foreground">Nov</div>
              <div className="text-xs text-muted-foreground">Dez</div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="bg-primary h-20 rounded" title="R$ 4.560"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
              <div className="bg-muted h-8 rounded" title="Previsto"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transações recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            Últimas transações processadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Salão da Maria - Plano Básico</p>
                  <p className="text-sm text-muted-foreground">15/01/2025 às 14:30</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+R$ 99,90</p>
                <Badge className="bg-green-100 text-green-800">Concluída</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Barbearia do João - Plano Premium</p>
                  <p className="text-sm text-muted-foreground">14/01/2025 às 09:15</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+R$ 149,90</p>
                <Badge className="bg-green-100 text-green-800">Concluída</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div>
                  <p className="font-medium">Estética Bella - Plano Premium</p>
                  <p className="text-sm text-muted-foreground">10/01/2025 às 16:45</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-yellow-600">R$ 149,90</p>
                <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div>
                  <p className="font-medium">Reembolso - Spa Relaxar</p>
                  <p className="text-sm text-muted-foreground">08/01/2025 às 11:20</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-R$ 99,90</p>
                <Badge className="bg-red-100 text-red-800">Reembolsada</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}