import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings,
  Save,
  Clock
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSalonSettings } from "@/hooks/useSalonSettings";

const defaultWorkingHours = {
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

// Ordem correta dos dias da semana
const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function Configuracoes() {
  const { settings, loading, updateSettings } = useSalonSettings();
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    scheduling_interval: 30,
    notifications_enabled: true,
    email_notifications_enabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Carregar dados quando settings estiver disponível
  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        description: settings.description || '',
        address: settings.address || '',
        phone: settings.phone || '',
        scheduling_interval: settings.scheduling_interval || 30,
        notifications_enabled: settings.notifications_enabled ?? true,
        email_notifications_enabled: settings.email_notifications_enabled ?? true,
      });
      
      // Carregar horários de funcionamento
      if (settings.working_hours) {
        setWorkingHours(settings.working_hours);
      }
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

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Salvar todas as configurações de uma vez
      const allSettings = {
        ...formData,
        working_hours: workingHours
      };
      
      const result = await updateSettings(allSettings);
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Todas as configurações foram salvas com sucesso!',
        });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Configuracoes - Save all error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
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
            Gerencie configurações gerais e horários de funcionamento
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-accent" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="barbershop-name">Nome da Empresa</Label>
              <Input 
                id="barbershop-name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nexio Premium" 
              />
            </div>
            
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
            
            <div>
              <Label htmlFor="interval">Intervalo entre Agendamentos (min)</Label>
              <Input 
                id="interval" 
                type="number" 
                value={formData.scheduling_interval}
                onChange={(e) => setFormData({...formData, scheduling_interval: parseInt(e.target.value) || 30})}
                placeholder="15" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificações SMS/WhatsApp</Label>
              <Switch 
                id="notifications" 
                checked={formData.notifications_enabled}
                onCheckedChange={(checked) => setFormData({...formData, notifications_enabled: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Notificações por E-mail</Label>
              <Switch 
                id="email-notifications" 
                checked={formData.email_notifications_enabled}
                onCheckedChange={(checked) => setFormData({...formData, email_notifications_enabled: checked})}
              />
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
              {daysOrder.map((day) => {
                const hours = workingHours[day as keyof typeof workingHours];
                return (
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
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Botão único para salvar todas as configurações */}
      <div className="flex justify-center">
        <Button 
          className="w-full max-w-md hover-gold"
          onClick={handleSaveAll}
          disabled={isSaving}
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Todas as Configurações'}
        </Button>
      </div>
    </div>
  );
}