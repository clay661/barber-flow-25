
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timer, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSalonSettings } from '@/hooks/useSalonSettings';

const intervalOptions = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
];

export function SchedulingIntervalForm() {
  const { settings, updateSettings } = useSalonSettings();
  const { toast } = useToast();
  const [interval, setInterval] = useState<number>(30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.scheduling_interval) {
      setInterval(settings.scheduling_interval);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings({ scheduling_interval: interval });
      
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Intervalo de agendamento salvo com sucesso!',
        });
      } else {
        throw new Error('Erro ao salvar intervalo');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar o intervalo de agendamento',
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
          <Timer className="h-5 w-5" />
          Intervalo de Agendamento
        </CardTitle>
        <CardDescription>
          Defina o intervalo mínimo entre agendamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Intervalo Mínimo</Label>
          <Select value={interval.toString()} onValueChange={(value) => setInterval(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {intervalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Intervalo'}
        </Button>
      </CardContent>
    </Card>
  );
}
