import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Clock, MapPin } from "lucide-react";
import { useSecuritySettings } from "@/hooks/useSuperAdminData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminSeguranca() {
  const { settings, loading, updateSettings } = useSecuritySettings();
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleToggle2FA = async (enabled: boolean) => {
    await updateSettings({ two_factor_enabled: enabled });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Simular alteração de senha (na implementação real, validaria a senha atual)
    await updateSettings({ last_password_change: new Date().toISOString() });
    
    setPasswordData({
      current: '',
      new: '',
      confirm: ''
    });

    toast({
      title: "Sucesso",
      description: "Senha alterada com sucesso",
    });
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

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
            <Switch 
              id="2fa-switch" 
              checked={settings?.two_factor_enabled || false}
              onCheckedChange={handleToggle2FA}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Status: <Badge className={settings?.two_factor_enabled ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {settings?.two_factor_enabled ? 'Ativado' : 'Desativado'}
              </Badge>
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
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid gap-4 max-w-md">
              <div>
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Digite a nova senha"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-fit">
                Alterar Senha
              </Button>
            </div>
            
            {settings?.last_password_change && (
              <p className="text-sm text-muted-foreground mt-4">
                Última alteração: {new Date(settings.last_password_change).toLocaleString('pt-BR')}
              </p>
            )}
          </form>
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