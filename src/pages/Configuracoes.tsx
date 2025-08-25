import { useState, useEffect } from 'react';
import { useSalonSettings } from '@/hooks/useSalonSettings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { validateDocument, formatDocument } from '@/lib/document-validation';

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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    scheduling_interval: 30,
    notifications_enabled: true,
    email_notifications_enabled: true,
    document_type: '' as 'cpf' | 'cnpj' | '',
    document_number: '',
  });

  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [documentError, setDocumentError] = useState('');

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
        document_type: settings.document_type || '',
        document_number: settings.document_number || '',
      });
      
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

  const handleDocumentChange = (value: string) => {
    if (!formData.document_type) return;
    
    const formattedValue = formatDocument(value, formData.document_type);
    setFormData({ ...formData, document_number: formattedValue });
    
    // Validar documento apenas se tiver conteúdo
    if (formattedValue.trim()) {
      const isValid = validateDocument(formattedValue, formData.document_type);
      setDocumentError(isValid ? '' : 'CPF/CNPJ inválido, corrija para salvar.');
    } else {
      setDocumentError('');
    }
  };

  const handleDocumentTypeChange = (type: 'cpf' | 'cnpj') => {
    setFormData({ 
      ...formData, 
      document_type: type,
      document_number: '' // Limpar o número ao mudar o tipo
    });
    setDocumentError('');
  };

  const handleSaveAll = async () => {
    // Validar documento se preenchido
    if (formData.document_number && formData.document_type) {
      const isValid = validateDocument(formData.document_number, formData.document_type);
      if (!isValid) {
        setDocumentError('CPF/CNPJ inválido, corrija para salvar.');
        toast.error('Corrija o CPF/CNPJ antes de salvar');
        return;
      }
    }

    try {
      const updateData = {
        ...formData,
        // Converter string vazia para null para tipos de documento
        document_type: formData.document_type || null,
        document_number: formData.document_number || null,
        working_hours: workingHours,
      };

      const result = await updateSettings(updateData);
      
      if (result.success) {
        toast.success('Configurações salvas com sucesso!');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie configurações gerais e horários de funcionamento
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie configurações gerais e horários de funcionamento
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nexio Premium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrição do estabelecimento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua das Flores, 123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label>Documento</Label>
              <div className="space-y-3">
                <Select
                  value={formData.document_type}
                  onValueChange={handleDocumentTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.document_type && (
                  <div>
                    <Input
                      value={formData.document_number}
                      onChange={(e) => handleDocumentChange(e.target.value)}
                      placeholder={
                        formData.document_type === 'cpf' 
                          ? '000.000.000-00' 
                          : '00.000.000/0000-00'
                      }
                      maxLength={formData.document_type === 'cpf' ? 14 : 18}
                    />
                    {documentError && (
                      <p className="text-sm text-destructive mt-1">{documentError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Intervalo entre Agendamentos (min)</Label>
              <Input
                id="interval"
                type="number"
                value={formData.scheduling_interval}
                onChange={(e) => setFormData({ ...formData, scheduling_interval: parseInt(e.target.value) || 30 })}
                placeholder="30"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificações SMS/WhatsApp</Label>
              <Switch
                id="notifications"
                checked={formData.notifications_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, notifications_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Notificações por E-mail</Label>
              <Switch
                id="email-notifications"
                checked={formData.email_notifications_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, email_notifications_enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Horários de Funcionamento */}
        <Card>
          <CardHeader>
            <CardTitle>Horários de Funcionamento</CardTitle>
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
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Botão para salvar todas as configurações */}
      <div className="flex justify-center">
        <Button 
          className="w-full max-w-md"
          onClick={handleSaveAll}
          size="lg"
          disabled={!!documentError}
        >
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}