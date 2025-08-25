import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Copy, MessageCircle, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmployeeCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  } | null;
}

export function EmployeeCredentialsModal({ 
  open, 
  onOpenChange, 
  credentials 
}: EmployeeCredentialsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: 'Copiado!',
        description: `${field} copiado para a área de transferência.`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const sendWhatsAppMessage = async () => {
    if (!credentials?.phone) {
      toast({
        title: 'Erro',
        description: 'Número de telefone não informado.',
        variant: 'destructive',
      });
      return;
    }

    setSendingWhatsApp(true);
    try {
      const message = `Olá ${credentials.name}! 

🎉 Suas credenciais de acesso foram criadas:

📧 Email: ${credentials.email}
🔑 Senha: ${credentials.password}

Você já pode acessar o sistema com essas informações.

Atenciosamente,
Equipe do Sistema`;

      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          phone: credentials.phone,
          message: message,
        },
      });

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Credenciais enviadas por WhatsApp!',
      });
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar as credenciais por WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setSendingWhatsApp(false);
    }
  };

  if (!credentials) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            Funcionário Cadastrado!
          </DialogTitle>
          <DialogDescription>
            As credenciais de acesso foram geradas automaticamente para <strong>{credentials.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Profissional</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                value={credentials.email}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(credentials.email, 'Email')}
                className="shrink-0"
              >
                {copiedField === 'Email' ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha Temporária</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                value={credentials.password}
                readOnly
                className="font-mono text-sm"
                type="text"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(credentials.password, 'Senha')}
                className="shrink-0"
              >
                {copiedField === 'Senha' ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Importante:</strong> Anote essas credenciais em local seguro. 
              O funcionário deve alterar a senha no primeiro acesso por segurança.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {credentials.phone && (
            <Button
              variant="outline"
              onClick={sendWhatsAppMessage}
              disabled={sendingWhatsApp}
              className="w-full sm:w-auto"
            >
              {sendingWhatsApp ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4 mr-2" />
              )}
              Enviar por WhatsApp
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}