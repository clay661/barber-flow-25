import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Check } from "lucide-react";

export default function SuperAdminPlanos() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos e Cobrança</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os planos de assinatura e configurações de cobrança
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Lista de planos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Plano Básico</CardTitle>
                <CardDescription>Para pequenos negócios</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold">R$ 99,90</div>
              <div className="text-sm text-muted-foreground">por mês</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Até 5 funcionários</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">100 clientes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Agendamentos ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Suporte por email</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Editar Plano
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative border-primary">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Plano Premium</CardTitle>
                <CardDescription>Para negócios em crescimento</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold">R$ 149,90</div>
              <div className="text-sm text-muted-foreground">por mês</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Até 15 funcionários</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">500 clientes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Agendamentos ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Relatórios avançados</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Suporte prioritário</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Editar Plano
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Plano Enterprise</CardTitle>
                <CardDescription>Para grandes empresas</CardDescription>
              </div>
              <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold">R$ 299,90</div>
              <div className="text-sm text-muted-foreground">por mês</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Funcionários ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Clientes ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">API personalizada</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Suporte 24/7</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Editar Plano
              </Button>
              <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Plano
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de cobrança */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Cobrança</CardTitle>
          <CardDescription>
            Configure as opções de cobrança e integração com Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Integração Stripe</h3>
                <p className="text-sm text-muted-foreground">
                  Configurar chaves da API do Stripe
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Período de Trial</h3>
                <p className="text-sm text-muted-foreground">
                  Definir período de teste gratuito: 7 dias
                </p>
              </div>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Taxas e Impostos</h3>
                <p className="text-sm text-muted-foreground">
                  Configurar taxas adicionais
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}