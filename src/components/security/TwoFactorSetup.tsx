import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Smartphone, Copy, Check, Key } from 'lucide-react';

interface TwoFactorSetupProps {
  userId: string;
  userType: 'super_admin' | 'employee';
  enabled: boolean;
  onStatusChange: (enabled: boolean) => void;
}

export function TwoFactorSetup({ userId, userType, enabled, onStatusChange }: TwoFactorSetupProps) {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationToken, setVerificationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSetup2FA = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: {
          userId,
          userType,
          action: 'setup'
        }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Erro ao configurar 2FA');
      }

      setQrUrl(data.qrUrl);
      setSecret(data.secret);
      setBackupCodes(data.backupCodes);
      setIsSetupMode(true);
      
      toast({
        title: "2FA Configurado",
        description: "Escaneie o QR code com seu app autenticador",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao configurar 2FA",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      toast({
        variant: "destructive",
        title: "Token inválido",
        description: "Digite um código de 6 dígitos",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: {
          userId,
          userType,
          action: 'verify',
          token: verificationToken
        }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Token inválido');
      }

      onStatusChange(true);
      setIsSetupMode(false);
      setVerificationToken('');
      
      toast({
        title: "2FA Ativado",
        description: "Autenticação de dois fatores foi ativada com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na verificação",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: {
          userId,
          userType,
          action: 'disable'
        }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Erro ao desativar 2FA');
      }

      onStatusChange(false);
      
      toast({
        title: "2FA Desativado",
        description: "Autenticação de dois fatores foi desativada",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao desativar 2FA",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, codeIndex?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (codeIndex !== undefined) {
        setCopiedCode(`backup-${codeIndex}`);
        setTimeout(() => setCopiedCode(null), 2000);
      } else {
        setCopiedCode('secret');
        setTimeout(() => setCopiedCode(null), 2000);
      }
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Autenticação de Dois Fatores (2FA)
        </CardTitle>
        <CardDescription>
          Adicione uma camada extra de segurança à sua conta
        </CardDescription>
        <div className="flex items-center gap-2">
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!enabled && !isSetupMode && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A autenticação de dois fatores adiciona uma camada extra de segurança, 
              exigindo um código do seu smartphone além da sua senha.
            </p>
            <Button onClick={handleSetup2FA} disabled={isLoading}>
              <Smartphone className="h-4 w-4 mr-2" />
              {isLoading ? "Configurando..." : "Configurar 2FA"}
            </Button>
          </div>
        )}

        {isSetupMode && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Escaneie o QR Code</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <img src={qrUrl} alt="QR Code para 2FA" className="w-48 h-48" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Use um app como Google Authenticator, Authy ou 1Password para escanear este QR code
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Ou digite manualmente</h3>
              <div className="space-y-2">
                <Label>Chave secreta:</Label>
                <div className="flex items-center gap-2">
                  <Input value={secret} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(secret)}
                  >
                    {copiedCode === 'secret' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">3. Digite o código de verificação</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="000000"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="font-mono text-center text-lg"
                />
                <Button onClick={handleVerify2FA} disabled={isLoading || verificationToken.length !== 6}>
                  {isLoading ? "Verificando..." : "Verificar"}
                </Button>
              </div>
            </div>

            {backupCodes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Códigos de backup
                </h3>
                <p className="text-sm text-muted-foreground">
                  Guarde estes códigos em local seguro. Você pode usá-los para acessar sua conta caso perca acesso ao seu dispositivo.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={code}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(code, index)}
                      >
                        {copiedCode === `backup-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {enabled && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A autenticação de dois fatores está ativa. Para fazer login, você precisará 
              inserir um código do seu app autenticador.
            </p>
            <Button variant="destructive" onClick={handleDisable2FA} disabled={isLoading}>
              {isLoading ? "Desativando..." : "Desativar 2FA"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}