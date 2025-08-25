import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Upload, 
  Settings,
  Save,
  Clock,
  Image,
  X
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSalonSettings } from "@/hooks/useSalonSettings";

const mockWorkingHours = {
  monday: { start: "08:00", end: "18:00", active: true },
  tuesday: { start: "08:00", end: "18:00", active: true },
  wednesday: { start: "08:00", end: "18:00", active: true },
  thursday: { start: "08:00", end: "18:00", active: true },
  friday: { start: "08:00", end: "18:00", active: true },
  saturday: { start: "08:00", end: "16:00", active: true },
  sunday: { start: "10:00", end: "14:00", active: false },
};

const dayNames = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira", 
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function Configuracoes() {
  const { settings, loading, updateSettings, uploadImage } = useSalonSettings();
  const [workingHours, setWorkingHours] = useState(mockWorkingHours);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    schedulingInterval: 30,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados quando settings estiver disponível
  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        description: settings.description || '',
        address: '', // Adicionar campo na tabela se necessário
        phone: '', // Adicionar campo na tabela se necessário  
        schedulingInterval: 30, // Adicionar campo na tabela se necessário
      });
    }
  }, [settings]);

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    try {
      const result = await uploadImage(file, type);
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: `${type === 'logo' ? 'Logo' : 'Banner'} atualizado com sucesso!`,
        });
      } else {
        throw new Error('Erro no upload');
      }
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

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const result = await updateSettings(formData);
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Configurações salvas com sucesso!',
        });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWorkingHours = () => {
    // Por enquanto, apenas simular o salvamento
    toast({
      title: 'Sucesso',
      description: 'Horários salvos com sucesso!',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie configurações gerais, horários e imagens do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Upload de Imagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-accent" />
              Imagens do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Logo da Barbearia</Label>
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                {settings?.logo_url ? (
                  <div className="relative">
                    <img 
                      src={settings.logo_url} 
                      alt="Logo" 
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="text-center">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="hover-glow"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {settings?.logo_url ? 'Alterar Logo' : 'Carregar Logo'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG até 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Banner Principal</Label>
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                {settings?.banner_url ? (
                  <div className="relative">
                    <img 
                      src={settings.banner_url} 
                      alt="Banner" 
                      className="w-full max-w-sm h-32 object-cover rounded-lg border"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-sm h-32 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="text-center">
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'banner')}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="hover-glow"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {settings?.banner_url ? 'Alterar Banner' : 'Carregar Banner'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG até 5MB
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários de Funcionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(workingHours).map(([day, hours]) => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {dayNames[day as keyof typeof dayNames]}
                    </Label>
                    <Switch
                      checked={hours.active}
                      onCheckedChange={(checked) => updateWorkingHours(day, 'active', checked)}
                    />
                  </div>
                  {hours.active && (
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Abertura</Label>
                        <Input
                          type="time"
                          value={hours.start}
                          onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Fechamento</Label>
                        <Input
                          type="time"
                          value={hours.end}
                          onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                  <Separator />
                </div>
              ))}
              <Button 
                className="w-full mt-4 hover-gold"
                onClick={handleSaveWorkingHours}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Horários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="barbershop-name">Nome da Barbearia</Label>
                <Input 
                  id="barbershop-name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nexio Premium" 
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua das Flores, 123" 
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(11) 99999-9999" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Breve descrição do estabelecimento" 
                />
              </div>
              <div>
                <Label htmlFor="interval">Intervalo entre Agendamentos (min)</Label>
                <Input 
                  id="interval" 
                  type="number" 
                  value={formData.schedulingInterval}
                  onChange={(e) => setFormData({...formData, schedulingInterval: parseInt(e.target.value) || 30})}
                  placeholder="15" 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificações Automáticas</Label>
                <Switch id="notifications" />
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/notificacoes'}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar SMS/WhatsApp/E-mail
                </Button>
              </div>
            </div>
          </div>
          <Button 
            className="mt-6 hover-gold"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}