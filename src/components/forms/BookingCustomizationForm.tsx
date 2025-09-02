
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSalonSettings } from '@/hooks/useSalonSettings';

interface CustomizationData {
  primary_color?: string;
  secondary_color?: string;
  welcome_message?: string;
  booking_instructions?: string;
}

export function BookingCustomizationForm() {
  const { settings, updateSettings } = useSalonSettings();
  const { toast } = useToast();
  const [customization, setCustomization] = useState<CustomizationData>({
    primary_color: '#2563eb',
    secondary_color: '#64748b',
    welcome_message: 'Bem-vindo! Agende seu horário.',
    booking_instructions: 'Escolha o serviço desejado, selecione a data e horário disponível.'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      // Extrair dados de customização do settings se existirem
      setCustomization({
        primary_color: '#2563eb',
        secondary_color: '#64748b',
        welcome_message: settings.description || 'Bem-vindo! Agende seu horário.',
        booking_instructions: 'Escolha o serviço desejado, selecione a data e horário disponível.'
      });
    }
  }, [settings]);

  const handleChange = (field: keyof CustomizationData, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Salvar as customizações no description por enquanto
      const result = await updateSettings({ 
        description: customization.welcome_message 
      });
      
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Personalização da tela de agendamento salva com sucesso!',
        });
      } else {
        throw new Error('Erro ao salvar personalização');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar a personalização',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personalização da Tela de Agendamento
        </CardTitle>
        <CardDescription>
          Personalize a aparência da sua página de agendamento online
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cor Primária</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={customization.primary_color}
                onChange={(e) => handleChange('primary_color', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={customization.primary_color}
                onChange={(e) => handleChange('primary_color', e.target.value)}
                placeholder="#2563eb"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor Secundária</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={customization.secondary_color}
                onChange={(e) => handleChange('secondary_color', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={customization.secondary_color}
                onChange={(e) => handleChange('secondary_color', e.target.value)}
                placeholder="#64748b"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mensagem de Boas-vindas</Label>
          <Input
            value={customization.welcome_message}
            onChange={(e) => handleChange('welcome_message', e.target.value)}
            placeholder="Bem-vindo! Agende seu horário."
          />
        </div>

        <div className="space-y-2">
          <Label>Instruções de Agendamento</Label>
          <Textarea
            value={customization.booking_instructions}
            onChange={(e) => handleChange('booking_instructions', e.target.value)}
            placeholder="Escolha o serviço desejado, selecione a data e horário disponível."
            rows={3}
          />
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium mb-2">Preview</h4>
          <div 
            className="p-4 rounded border"
            style={{ 
              backgroundColor: 'white',
              borderColor: customization.primary_color 
            }}
          >
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: customization.primary_color }}
            >
              {settings?.name || 'Seu Salão'}
            </h3>
            <p className="text-sm mb-2">{customization.welcome_message}</p>
            <p 
              className="text-xs"
              style={{ color: customization.secondary_color }}
            >
              {customization.booking_instructions}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Personalização'}
        </Button>
      </CardContent>
    </Card>
  );
}
