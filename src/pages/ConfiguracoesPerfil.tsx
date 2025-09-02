
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Phone, Mail, Lock } from 'lucide-react';

export default function ConfiguracoesPerfil() {
  const { employee } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    telefone: employee?.telefone || '',
    pro_email: employee?.pro_email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!employee?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: formData.name,
          telefone: formData.telefone,
        })
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Informações do perfil atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as informações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!employee?.id) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Erro',
        description: 'A nova senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setLoadingPassword(true);
    try {
      // Verificar senha atual
      const { data: currentEmployee, error: checkError } = await supabase
        .from('employees')
        .select('pro_password')
        .eq('id', employee.id)
        .eq('pro_password', passwordData.currentPassword)
        .single();

      if (checkError || !currentEmployee) {
        throw new Error('Senha atual incorreta');
      }

      // Atualizar senha
      const { error } = await supabase
        .from('employees')
        .update({
          pro_password: passwordData.newPassword,
        })
        .eq('id', employee.id);

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast({
        title: 'Sucesso!',
        description: 'Senha alterada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível alterar a senha.',
        variant: 'destructive',
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações do Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações de acesso
        </p>
      </div>

      <div className="grid gap-6">
        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Atualize seus dados pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pro_email">Email Profissional</Label>
              <Input
                id="pro_email"
                value={formData.pro_email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                O email profissional não pode ser alterado. Entre em contato com o administrador se necessário.
              </p>
            </div>

            <Button onClick={handleSaveProfile} disabled={loading} className="w-full md:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura alterando sua senha regularmente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="Digite sua senha atual"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Digite a nova senha"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            <Button 
              onClick={handleChangePassword} 
              disabled={loadingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full md:w-auto"
            >
              {loadingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Informações do Cargo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Informações do Cargo
            </CardTitle>
            <CardDescription>
              Suas informações de trabalho e permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cargo</Label>
                <div className="p-3 rounded-md bg-muted">
                  <span className="font-medium">
                    {employee?.role === 'ADMIN' && 'Administrador'}
                    {employee?.role === 'FUNCIONARIO' && 'Funcionário'}
                    {employee?.role === 'RECEPCIONISTA' && 'Recepcionista'}
                    {employee?.role === 'SUBADMIN' && 'Sub-administrador'}
                    {employee?.role === 'OUTRO' && (employee?.custom_role_name || 'Outro')}
                  </span>
                </div>
              </div>

              {employee?.role === 'FUNCIONARIO' && (
                <div className="space-y-2">
                  <Label>Comissão</Label>
                  <div className="p-3 rounded-md bg-muted">
                    <span className="font-medium">
                      {employee?.commission_type === 'percentage' 
                        ? `${employee.commission_value}% por serviço` 
                        : `R$ ${employee.commission_value} fixo`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
