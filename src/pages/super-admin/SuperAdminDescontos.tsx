import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Edit, Trash2, Percent, DollarSign } from "lucide-react";

export default function SuperAdminDescontos() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cupons de Desconto</h1>
          <p className="text-muted-foreground mt-2">
            Crie e gerencie cupons de desconto para seus clientes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cupom
        </Button>
      </div>

      {/* Formulário de Criação */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Cupom</CardTitle>
          <CardDescription>
            Configure os detalhes do seu cupom de desconto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="coupon-code">Código do Cupom</Label>
              <Input
                id="coupon-code"
                placeholder="Ex: DESCONTO20"
                className="uppercase"
              />
            </div>
            <div>
              <Label htmlFor="coupon-type">Tipo de Desconto</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentual (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="discount-value">Valor do Desconto</Label>
              <Input
                id="discount-value"
                type="number"
                placeholder="20"
              />
            </div>
            <div>
              <Label htmlFor="usage-limit">Limite de Uso</Label>
              <Input
                id="usage-limit"
                type="number"
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="start-date">Data de Início</Label>
              <Input
                id="start-date"
                type="date"
              />
            </div>
            <div>
              <Label htmlFor="end-date">Data de Expiração</Label>
              <Input
                id="end-date"
                type="date"
              />
            </div>
          </div>

          <Button>Criar Cupom</Button>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cupons Ativos</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">
              12 cupons expirados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usos Este Mês</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +18% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desconto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 3.420,00</div>
            <p className="text-xs text-muted-foreground">
              Valor total descontado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cupons */}
      <Card>
        <CardHeader>
          <CardTitle>Cupons Cadastrados</CardTitle>
          <CardDescription>
            Gerencie todos os seus cupons de desconto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">DESCONTO20</h3>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  <Badge variant="outline">20% OFF</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <span>Usado: 45/100</span>
                  <span>Criado: 15/01/2025</span>
                  <span>Expira: 31/01/2025</span>
                  <span>Economia: R$ 890,00</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">PRIMEIRA30</h3>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  <Badge variant="outline">30% OFF</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <span>Usado: 23/50</span>
                  <span>Criado: 10/01/2025</span>
                  <span>Expira: 28/02/2025</span>
                  <span>Economia: R$ 1.240,00</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">NATAL50</h3>
                  <Badge className="bg-red-100 text-red-800">Expirado</Badge>
                  <Badge variant="outline">R$ 50,00 OFF</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <span>Usado: 200/200</span>
                  <span>Criado: 01/12/2024</span>
                  <span>Expirou: 31/12/2024</span>
                  <span>Economia: R$ 10.000,00</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">FRETE15</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>
                  <Badge variant="outline">15% OFF</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <span>Usado: 12/∞</span>
                  <span>Criado: 20/01/2025</span>
                  <span>Expira: 30/06/2025</span>
                  <span>Economia: R$ 180,00</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}