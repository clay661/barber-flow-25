
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSalonSettings } from '@/hooks/useSalonSettings';

interface WorkingDay {
  start: string;
  end: string;
  active: boolean;
}

interface WorkingHours {
  monday: WorkingDay;
  tuesday: WorkingDay;
  wednesday: WorkingDay;
  thursday: WorkingDay;
  friday: WorkingDay;
  saturday: WorkingDay;
  sunday: WorkingDay;
}

const dayNames = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export function WorkingHoursForm() {
  const { settings, updateSettings } = useSalonSettings();
  const { toast } = useToast();
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { start: "08:00", end: "18:00", active: true },
    tuesday: { start: "08:00", end: "18:00", active: true },
    wednesday: { start: "08:00", end: "18:00", active: true },
    thursday: { start: "08:00", end: "18:00", active: true },
    friday: { start: "08:00", end: "18:00", active: true },
    saturday: { start: "08:00", end: "16:00", active: true },
    sunday: { start: "10:00", end: "14:00", active: false },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.working_hours) {
      setWorkingHours(settings.working_hours);
    }
  }, [settings]);

  const handleDayChange = (day: keyof WorkingHours, field: keyof WorkingDay, value: any) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings({ working_hours: workingHours });
      
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Horários de funcionamento salvos com sucesso!',
        });
      } else {
        throw new Error('Erro ao salvar horários');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar os horários de funcionamento',
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
          <Clock className="h-5 w-5" />
          Horários de Funcionamento
        </CardTitle>
        <CardDescription>
          Configure os dias e horários de funcionamento do seu estabelecimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(workingHours).map(([day, hours]) => (
          <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Switch
                checked={hours.active}
                onCheckedChange={(checked) => handleDayChange(day as keyof WorkingHours, 'active', checked)}
              />
              <Label className="font-medium min-w-[120px]">
                {dayNames[day as keyof typeof dayNames]}
              </Label>
            </div>
            
            {hours.active && (
              <div className="flex items-center space-x-2">
                <Label className="text-sm">De:</Label>
                <Input
                  type="time"
                  value={hours.start}
                  onChange={(e) => handleDayChange(day as keyof WorkingHours, 'start', e.target.value)}
                  className="w-24"
                />
                <Label className="text-sm">Até:</Label>
                <Input
                  type="time"
                  value={hours.end}
                  onChange={(e) => handleDayChange(day as keyof WorkingHours, 'end', e.target.value)}
                  className="w-24"
                />
              </div>
            )}
            
            {!hours.active && (
              <span className="text-muted-foreground text-sm">Fechado</span>
            )}
          </div>
        ))}
        
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Horários'}
        </Button>
      </CardContent>
    </Card>
  );
}
