import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Copy, Download, Upload, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSalonSettings } from '@/hooks/useSalonSettings';
import { useAuth } from '@/hooks/useAuth';

const Divulgacao = () => {
  const { employee } = useAuth();
  const isAdmin = employee?.role === 'ADMIN' || employee?.role === 'SUBADMIN';
  const { settings, loading, updateSettings, uploadImage } = useSalonSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    public_link: '',
  });
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Atualizar formData quando settings carregarem
  React.useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        description: settings.description || '',
        public_link: settings.public_link || '',
      });
      
      // Gerar QR Code
      if (settings.public_link) {
        const bookingUrl = `${window.location.origin}/agendamento/${settings.public_link}`;
        generateQRCode(bookingUrl);
      }
    }
  }, [settings]);

  const generateQRCode = async (url: string) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'public_link' && value) {
      const bookingUrl = `${window.location.origin}/agendamento/${value}`;
      generateQRCode(bookingUrl);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    if (!isAdmin) {
      toast({
        title: 'Acesso negado',
        description: 'Apenas administradores podem alterar as imagens.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await uploadImage(file, type);
      toast({
        title: 'Sucesso',
        description: `${type === 'logo' ? 'Logo' : 'Banner'} atualizado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: `Erro ao fazer upload do ${type === 'logo' ? 'logo' : 'banner'}.`,
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file, type);
      } else {
        toast({
          title: 'Arquivo inválido',
          description: 'Por favor, selecione apenas arquivos de imagem.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast({
        title: 'Acesso negado',
        description: 'Apenas administradores podem salvar alterações.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings(formData);
      toast({
        title: 'Sucesso',
        description: 'Informações de divulgação salvas com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar as informações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    if (settings?.public_link) {
      const bookingUrl = `${window.location.origin}/agendamento/${settings.public_link}`;
      navigator.clipboard.writeText(bookingUrl);
      toast({
        title: 'Link copiado!',
        description: 'O link público foi copiado para a área de transferência.',
      });
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'qrcode-agendamento.png';
      link.href = qrCodeUrl;
      link.click();
      toast({
        title: 'QR Code baixado!',
        description: 'O QR Code foi baixado com sucesso.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const bookingUrl = settings?.public_link ? `${window.location.origin}/agendamento/${settings.public_link}` : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Divulgação</h1>
        <p className="text-muted-foreground">
          Gerencie as informações de divulgação do seu estabelecimento
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informações do Estabelecimento */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Estabelecimento</CardTitle>
            <CardDescription>
              {isAdmin ? 'Configure as informações principais' : 'Visualização das informações'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Estabelecimento</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome da empresa"
                disabled={!isAdmin}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Breve descrição do estabelecimento"
                disabled={!isAdmin}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="public_link">Link Público de Agendamento</Label>
              <Input
                id="public_link"
                value={formData.public_link}
                onChange={(e) => handleInputChange('public_link', e.target.value)}
                placeholder="link-personalizado"
                disabled={!isAdmin}
              />
            </div>

            {isAdmin && (
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Informações'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardHeader>
            <CardTitle>Imagens do Estabelecimento</CardTitle>
            <CardDescription>
              {isAdmin ? 'Faça upload do logo e banner' : 'Visualização das imagens'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="space-y-3">
              <Label>Logo</Label>
              <div className="flex flex-col items-center space-y-3">
                {settings?.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt="Logo"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Sem logo</span>
                  </div>
                )}
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar Logo
                  </Button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logo')}
                  className="hidden"
                />
              </div>
            </div>

            {/* Banner */}
            <div className="space-y-3">
              <Label>Banner</Label>
              <div className="flex flex-col items-center space-y-3">
                {settings?.banner_url ? (
                  <img
                    src={settings.banner_url}
                    alt="Banner"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Sem banner</span>
                  </div>
                )}
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar Banner
                  </Button>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'banner')}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code e Link */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>QR Code e Link de Agendamento</CardTitle>
          <CardDescription>
            Compartilhe o link ou QR Code para que clientes possam agendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            {/* QR Code centralizado */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-2xl border shadow-lg">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code do agendamento"
                    className="w-56 h-56"
                  />
                ) : (
                  <div className="w-56 h-56 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Configure o link primeiro</span>
                  </div>
                )}
              </div>
              {qrCodeUrl && (
                <Button onClick={downloadQRCode} variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar QR Code
                </Button>
              )}
            </div>

            {/* Link centralizado */}
            <div className="w-full max-w-2xl space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold">Link de Agendamento</Label>
                <div className="flex mt-3">
                  <Input
                    value={bookingUrl}
                    readOnly
                    className="rounded-r-none text-center bg-muted/50"
                  />
                  <Button
                    onClick={copyLink}
                    variant="default"
                    className="rounded-l-none border-l-0 px-6"
                    disabled={!bookingUrl}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <h4 className="font-medium mb-3">Como usar:</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• Compartilhe o link com clientes</div>
                  <div>• Cole o QR Code no estabelecimento</div>
                  <div>• Publique nas redes sociais</div>
                  <div>• Adicione ao site ou cartão</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Divulgacao;