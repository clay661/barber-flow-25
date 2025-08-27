import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QrCode, Download, Link, Copy } from 'lucide-react';

interface QRCodeGeneratorProps {
  publicLink: string;
  className?: string;
}

export function QRCodeGenerator({ publicLink, className = '' }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!publicLink) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Link público não encontrado",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-qr-code', {
        body: { publicLink }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Erro ao gerar QR Code');
      }

      setQrCodeUrl(data.qrCodeUrl);
      setBookingUrl(data.bookingUrl);
      
      toast({
        title: "QR Code gerado!",
        description: "O QR Code foi gerado com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
      });
    }
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${publicLink}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download iniciado",
        description: "O QR Code está sendo baixado",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no download",
        description: "Não foi possível baixar o QR Code",
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Gerador de QR Code
        </CardTitle>
        <CardDescription>
          Gere um QR Code para facilitar o acesso dos clientes ao agendamento online
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Link público de agendamento:</Label>
            <div className="flex gap-2">
              <Input
                value={bookingUrl || `${window.location.origin}/booking/${publicLink}`}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bookingUrl || `${window.location.origin}/booking/${publicLink}`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button onClick={generateQRCode} disabled={isGenerating || !publicLink}>
            <QrCode className="h-4 w-4 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar QR Code"}
          </Button>
        </div>

        {qrCodeUrl && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <img
                  src={qrCodeUrl}
                  alt="QR Code para agendamento"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Clientes podem escanear este QR Code para acessar diretamente o agendamento online
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={downloadQRCode} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar QR Code
              </Button>
              <Button onClick={() => copyToClipboard(bookingUrl)} variant="outline">
                <Link className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}