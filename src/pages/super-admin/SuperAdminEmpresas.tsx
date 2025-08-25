import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Key } from "lucide-react";

export default function SuperAdminEmpresas() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Empresas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todas as empresas cadastradas no sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Barra de pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar empresas..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Total: 12 empresas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Exemplos de empresas */}
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
                <p className="text-xs text-muted-foreground">
                  Cadastrada em: 15/12/2024
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-1" />
                  Resetar Senha
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
                  <h3 className="font-semibold">Barbearia do João</h3>
                  <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: joao@barbearia.com
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  CNPJ: 98.765.432/0001-12
                </p>
                <p className="text-xs text-muted-foreground">
                  Cadastrada em: 10/12/2024
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-1" />
                  Resetar Senha
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
                  <h3 className="font-semibold">Estética Bella</h3>
                  <Badge className="bg-red-100 text-red-800">Suspensa</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email: contato@esteticabella.com
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  CNPJ: 11.222.333/0001-44
                </p>
                <p className="text-xs text-muted-foreground">
                  Cadastrada em: 05/12/2024
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-1" />
                  Resetar Senha
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