import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Clock, MapPin } from "lucide-react";

export default function SuperAdminSeguranca() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Segurança</h1>
        <p className="text-muted-foreground mt-2">
          Configurações de segurança e controle de acesso
        </p>
      </div>

      {/* Configuração 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autenticação em Duas Etapas (2FA)
          </CardTitle>
          <CardDescription>
            Configure a autenticação em duas etapas para maior segurança
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa-switch">Ativar 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Adicione uma camada extra de segurança ao seu login
              </p>
            </div>
            <Switch id="2fa-switch" />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Status: <Badge className="bg-yellow-100 text-yellow-800">Desativado</Badge>
            </p>
            <Button variant="outline" size="sm">
              Configurar Google Authenticator
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alteração de Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Alteração de Senha
          </CardTitle>
          <CardDescription>
            Altere sua senha de acesso ao painel Super Admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 max-w-md">
            <div>
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Digite sua senha atual"
              />
            </div>
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite a nova senha"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme a nova senha"
              />
            </div>
            <Button className="w-fit">
              Alterar Senha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log de Acessos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Log de Acessos Recentes
          </CardTitle>
          <CardDescription>
            Histórico dos últimos acessos ao painel Super Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Login realizado com sucesso</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    25/01/2025 14:30:15
                    <MapPin className="h-3 w-3 ml-2" />
                    IP: 192.168.1.100
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Login realizado com sucesso</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    24/01/2025 09:15:42
                    <MapPin className="h-3 w-3 ml-2" />
                    IP: 192.168.1.100
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div>
                  <p className="font-medium">Tentativa de login falhada</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    23/01/2025 18:45:20
                    <MapPin className="h-3 w-3 ml-2" />
                    IP: 203.45.67.89
                  </p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800">Falha</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Login realizado com sucesso</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    23/01/2025 08:20:10
                    <MapPin className="h-3 w-3 ml-2" />
                    IP: 192.168.1.100
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div>
                  <p className="font-medium">Tentativa de login falhada</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    22/01/2025 22:10:35
                    <MapPin className="h-3 w-3 ml-2" />
                    IP: 185.92.34.12
                  </p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800">Falha</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}