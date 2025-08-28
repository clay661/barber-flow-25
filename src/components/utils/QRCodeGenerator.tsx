
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

export function QRCodeGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [customPath, setCustomPath] = useState('agendamento');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // URL base do sistema público (usando o dominio atual)
  const baseUrl = window.location.origin;
  const publicUrl = `${baseUrl}/public/${customPath}`;

  const generateQRCode = async () => {
    if (!customPath.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite um nome para o link personalizado',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Gerar QR Code com a URL pública
      const qrDataUrl = await QRCodeLib.toDataURL(publicUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
      
      toast({
        title: 'Sucesso!',
        description: 'QR Code gerado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o QR Code.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${customPath}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast({
        title: 'Copiado!',
        description: 'Link copiado para a área de transferência.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Gerar QR Code</h2>
        <p className="text-sm text-muted-foreground">
          Crie um QR Code personalizado para seus clientes acessarem a página de agendamento
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="custom-path">Nome do Link Personalizado</Label>
          <Input
            id="custom-path"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
            placeholder="agendamento"
            className="max-w-sm"
          />
          <p className="text-xs text-muted-foreground">
            Seu link será: <span className="font-mono">{publicUrl}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateQRCode} 
            disabled={loading || !customPath.trim()}
            className="flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            {loading ? 'Gerando...' : 'Gerar QR Code'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={copyLink}
            className="flex items-center gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copiado!' : 'Copiar Link'}
          </Button>
        </div>
      </div>

      {qrCodeUrl && (
        <div className="space-y-4">
          <div className="border rounded-lg p-6 text-center bg-white">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="mx-auto mb-4"
              width={256}
              height={256}
            />
            <p className="text-sm text-muted-foreground mb-4">
              QR Code para: <span className="font-mono text-primary">{publicUrl}</span>
            </p>
            <Button onClick={downloadQRCode} variant="outline" className="flex items-center gap-2 mx-auto">
              <Download className="h-4 w-4" />
              Baixar QR Code
            </Button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Como usar:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Personalize o nome do seu link</li>
          <li>• Gere o QR Code e baixe a imagem</li>
          <li>• Compartilhe o QR Code com seus clientes</li>
          <li>• Clientes podem escanear e agendar diretamente</li>
        </ul>
      </div>
    </div>
  );
}
