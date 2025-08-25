import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Scissors } from 'lucide-react';
import barbershopLogo from "@/assets/barbershop-logo.jpg";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const { login, register, checkAdminExists, employee, loading } = useAuth();
  const { toast } = useToast();

  // Check if admin exists on component mount
  useEffect(() => {
    const checkAdmin = async () => {
      const exists = await checkAdminExists();
      setAdminExists(exists);
    };
    
    if (!loading) {
      checkAdmin();
    }
  }, [loading, checkAdminExists]);

  // Redirect if already logged in
  if (!loading && employee) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const result = await register(name, email, password);
        
        if (result.success) {
          toast({
            title: "Administrador cadastrado com sucesso!",
            description: "Agora você pode fazer login com seus dados.",
          });
          // Reset form and switch to login mode
          setName('');
          setEmail('');
          setPassword('');
          setIsRegisterMode(false);
          setAdminExists(true);
        } else {
          toast({
            variant: "destructive",
            title: "Erro no cadastro",
            description: result.error || "Não foi possível cadastrar o administrador",
          });
        }
      } else {
        const result = await login(email, password);
        
        if (result.success) {
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo ao sistema!",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: result.error || "Credenciais inválidas",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: isRegisterMode ? "Erro no cadastro" : "Erro no login",
        description: "Ocorreu um erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={barbershopLogo} 
              alt="Nexio" 
              className="w-16 h-16 rounded-lg shadow-md"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Scissors className="h-6 w-6 text-accent" />
              Nexio
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isRegisterMode ? "Cadastro do Administrador" : "Sistema de Gestão Empresarial"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{isRegisterMode ? "E-mail" : "Email Profissional"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={isRegisterMode ? "seu@email.com" : "seu.email@meusalon.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegisterMode ? "Mínimo 6 caracteres" : ""}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background pr-10"
                  minLength={isRegisterMode ? 6 : undefined}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegisterMode ? "Cadastrando..." : "Entrando...") 
                : (isRegisterMode ? "Criar Administrador" : "Entrar no Sistema")
              }
            </Button>
            
            {!adminExists && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setName('');
                  setEmail('');
                  setPassword('');
                }}
                disabled={isLoading}
              >
                {isRegisterMode ? "Já tenho uma conta" : "Cadastrar Novo Usuário"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}