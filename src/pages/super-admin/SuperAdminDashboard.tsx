import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, CreditCard } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Super Admin</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral completa do sistema SaaS
        </p>
      </div>

      {/* Estatísticas principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Empresas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              Funcionários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4.560,00</div>
            <p className="text-xs text-muted-foreground">
              Mês atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">
              4 canceladas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Últimos pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Pagamentos</CardTitle>
          <CardDescription>
            Histórico dos pagamentos mais recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Salão da Maria</p>
                  <p className="text-sm text-muted-foreground">15/01/2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ 99,90</p>
                <p className="text-sm text-green-600">Pago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Barbearia do João</p>
                  <p className="text-sm text-muted-foreground">14/01/2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ 149,90</p>
                <p className="text-sm text-green-600">Pago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div>
                  <p className="font-medium">Estética Bella</p>
                  <p className="text-sm text-muted-foreground">10/01/2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ 199,90</p>
                <p className="text-sm text-yellow-600">Pendente</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}