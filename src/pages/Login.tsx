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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, employee, loading } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (!loading && employee) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
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
              Sistema de Gestão para Barbearias
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Profissional</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@meusalon.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background pr-10"
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
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar no Sistema"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}