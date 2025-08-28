
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useSuperAuth } from '@/hooks/useSuperAuth';
import { Eye, EyeOff, Lock, Mail, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { employee, login, register, checkAdminExists } = useAuth();
  const { superAdmin, login: superLogin } = useSuperAuth();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Formulário regular
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Formulário super admin
  const [superFormData, setSuperFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const exists = await checkAdminExists();
      setAdminExists(exists);
      setIsLogin(exists);
    };
    checkAdmin();
  }, [checkAdminExists]);

  useEffect(() => {
    if (employee) {
      navigate('/');
    } else if (superAdmin) {
      navigate('/super-admin');
    }
  }, [employee, superAdmin, navigate]);

  const validateForm = (data: any, isRegister = false) => {
    const newErrors: Record<string, string> = {};

    if (isRegister && !data.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!data.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!data.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (isRegister && data.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, !isLogin);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setErrors({ general: result.error || 'Credenciais inválidas' });
        }
      } else {
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
          setAdminExists(true);
          setIsLogin(true);
          toast({
            title: 'Sucesso!',
            description: 'Administrador criado com sucesso! Agora você pode fazer login.',
          });
          setFormData({ name: '', email: formData.email, password: '' });
        } else {
          setErrors({ general: result.error || 'Erro ao criar administrador' });
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro interno do servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuperLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(superFormData, false);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await superLogin(superFormData.email, superFormData.password);
      if (!result.success) {
        setErrors({ general: result.error || 'Credenciais inválidas' });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro interno do servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Meu Salão</h1>
          <p className="text-muted-foreground">Sistema de gestão completo</p>
        </div>

        <Tabs defaultValue="regular" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regular">Acesso Regular</TabsTrigger>
            <TabsTrigger value="super">Super Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="regular">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">
                  {isLogin ? 'Entrar no sistema' : 'Criar administrador'}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'Digite suas credenciais para acessar' 
                    : 'Configure sua conta de administrador'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{errors.general}</p>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Digite seu nome"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar conta')}
                  </Button>

                  {adminExists && (
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setErrors({});
                          setFormData({ name: '', email: '', password: '' });
                        }}
                        className="text-sm"
                      >
                        {isLogin ? 'Não tem conta? Criar nova' : 'Já tem conta? Fazer login'}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="super">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Super Administrador</CardTitle>
                <CardDescription>
                  Acesso exclusivo para gestão do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSuperLogin} className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{errors.general}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="super-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="super-email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={superFormData.email}
                        onChange={(e) => setSuperFormData({ ...superFormData, email: e.target.value })}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="super-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="super-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        value={superFormData.password}
                        onChange={(e) => setSuperFormData({ ...superFormData, password: e.target.value })}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Processando...' : 'Entrar como Super Admin'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
