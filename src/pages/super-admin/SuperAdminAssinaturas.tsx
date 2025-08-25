import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ToggleLeft, ToggleRight } from "lucide-react";

export default function SuperAdminAssinaturas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão de Assinaturas</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie todas as assinaturas do sistema
        </p>
      </div>

      {/* Barra de pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar assinaturas..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de assinaturas */}
      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
          <CardDescription>
            Total: 8 assinaturas ativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">Salão da Maria</h3>
                  <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: maria@salaodamaria.com
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  CNPJ: 12.345.678/0001-90
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  Plano: Plano Básico - R$ 99,90
                </p>
                <p className="text-xs text-muted-foreground">
                  Próximo vencimento: 15/02/2025
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Histórico
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <ToggleRight className="h-4 w-4 mr-1" />
                  Desativar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">Barbearia do João</h3>
                  <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: joao@barbearia.com
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  CNPJ: 98.765.432/0001-12
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  Plano: Plano Premium - R$ 149,90
                </p>
                <p className="text-xs text-muted-foreground">
                  Próximo vencimento: 10/02/2025
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Histórico
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <ToggleRight className="h-4 w-4 mr-1" />
                  Desativar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">Estética Bella</h3>
                  <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: contato@esteticabella.com
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  CNPJ: 11.222.333/0001-44
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  Plano: Plano Premium - R$ 149,90
                </p>
                <p className="text-xs text-muted-foreground">
                  Cancelada em: 05/01/2025
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Histórico
                </Button>
                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                  <ToggleLeft className="h-4 w-4 mr-1" />
                  Ativar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}