import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Link, Copy, Eye, DollarSign, Users, MousePointer } from "lucide-react";

export default function SuperAdminAfiliados() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Programa de Afiliados</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie parceiros e links de afiliados
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Afiliado
        </Button>
      </div>

      {/* Status do Programa */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Programa de Afiliados</CardTitle>
          <CardDescription>
            Configure se o programa de afiliados está ativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="affiliate-program">Programa Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que afiliados ganhem comissões por indicações
              </p>
            </div>
            <Switch id="affiliate-program" defaultChecked />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="commission-rate">Taxa de Comissão (%)</Label>
              <Input
                id="commission-rate"
                type="number"
                placeholder="15"
                defaultValue="15"
              />
            </div>
            <div>
              <Label htmlFor="cookie-duration">Duração do Cookie (dias)</Label>
              <Input
                id="cookie-duration"
                type="number"
                placeholder="30"
                defaultValue="30"
              />
            </div>
          </div>

          <Button>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cadastros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Taxa de conversão: 7.1%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.340,00</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Afiliados */}
      <Card>
        <CardHeader>
          <CardTitle>Afiliados Ativos</CardTitle>
          <CardDescription>
            Gerencie seus parceiros afiliados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">João Silva</h3>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: joao.silva@email.com
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Cliques: 234</span>
                  <span>Conversões: 18</span>
                  <span>Comissão: R$ 270,00</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value="https://meusaas.com/ref/joao123"
                    readOnly
                    className="text-xs"
                    size={30}
                  />
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Relatório
                </Button>
                <Button variant="outline" size="sm">
                  <Link className="h-4 w-4 mr-1" />
                  Novo Link
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">Maria Santos</h3>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: maria.santos@email.com
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Cliques: 189</span>
                  <span>Conversões: 12</span>
                  <span>Comissão: R$ 180,00</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value="https://meusaas.com/ref/maria456"
                    readOnly
                    className="text-xs"
                    size={30}
                  />
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Relatório
                </Button>
                <Button variant="outline" size="sm">
                  <Link className="h-4 w-4 mr-1" />
                  Novo Link
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">Carlos Lima</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: carlos.lima@email.com
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Cliques: 56</span>
                  <span>Conversões: 3</span>
                  <span>Comissão: R$ 45,00</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value="https://meusaas.com/ref/carlos789"
                    readOnly
                    className="text-xs"
                    size={30}
                  />
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Relatório
                </Button>
                <Button variant="outline" size="sm">
                  <Link className="h-4 w-4 mr-1" />
                  Novo Link
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}