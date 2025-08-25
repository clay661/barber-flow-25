import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ClientData {
  name: string;
  phone: string;
  email: string;
}

interface ClientFormProps {
  clientData: ClientData;
  onDataChange: (data: ClientData) => void;
}

export function ClientForm({ clientData, onDataChange }: ClientFormProps) {
  const handleChange = (field: keyof ClientData, value: string) => {
    onDataChange({
      ...clientData,
      [field]: value
    });
  };

  const formatPhone = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Apply mask: (11) 99999-9999
    if (cleaned.length <= 11) {
      const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
      if (match) {
        return [
          match[1] && `(${match[1]}`,
          match[2] && `) ${match[2]}`,
          match[3] && `-${match[3]}`
        ].filter(Boolean).join('');
      }
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    handleChange('phone', formatted);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Informe seus dados para finalizar o agendamento:
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={clientData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone/WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={clientData.phone}
              onChange={handlePhoneChange}
              maxLength={15}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={clientData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Após confirmar o agendamento, você receberá uma confirmação. 
              O agendamento será analisado pela equipe e você será notificado sobre a confirmação final.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}