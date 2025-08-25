import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NotificationSettings } from '@/hooks/useNotifications';

interface NotificationSettingsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<NotificationSettings, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  settings?: NotificationSettings | null;
  loading?: boolean;
}

export function NotificationSettingsForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  settings, 
  loading = false 
}: NotificationSettingsFormProps) {
  const [formData, setFormData] = useState({
    provider: 'twilio' as 'twilio' | 'ultramsg',
    api_key_sid: '',
    auth_token: '',
    phone_number: '',
    is_active: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        provider: settings.provider,
        api_key_sid: settings.api_key_sid,
        auth_token: settings.auth_token,
        phone_number: settings.phone_number,
        is_active: settings.is_active,
      });
    } else {
      setFormData({
        provider: 'twilio',
        api_key_sid: '',
        auth_token: '',
        phone_number: '',
        is_active: true,
      });
    }
  }, [settings, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onOpenChange(false);
  };

  const getPlaceholderText = () => {
    if (formData.provider === 'twilio') {
      return {
        apiKey: 'Account SID (ex: ACxxxxx)',
        authToken: 'Auth Token',
        phoneNumber: '+5511999999999'
      };
    } else {
      return {
        apiKey: 'Instance ID',
        authToken: 'Token',
        phoneNumber: '5511999999999'
      };
    }
  };

  const placeholders = getPlaceholderText();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {settings ? 'Editar Configurações' : 'Nova Configuração'}
          </DialogTitle>
          <DialogDescription>
            Configure as credenciais para envio automático de SMS/WhatsApp.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Provedor *</Label>
            <Select
              value={formData.provider}
              onValueChange={(value: 'twilio' | 'ultramsg') => 
                setFormData({ ...formData, provider: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o provedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio (SMS)</SelectItem>
                <SelectItem value="ultramsg">UltraMsg (WhatsApp)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_key_sid">
              {formData.provider === 'twilio' ? 'Account SID' : 'Instance ID'} *
            </Label>
            <Input
              id="api_key_sid"
              value={formData.api_key_sid}
              onChange={(e) => setFormData({ ...formData, api_key_sid: e.target.value })}
              placeholder={placeholders.apiKey}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth_token">
              {formData.provider === 'twilio' ? 'Auth Token' : 'Token'} *
            </Label>
            <Input
              id="auth_token"
              type="password"
              value={formData.auth_token}
              onChange={(e) => setFormData({ ...formData, auth_token: e.target.value })}
              placeholder={placeholders.authToken}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">
              {formData.provider === 'twilio' ? 'Número Twilio' : 'Número WhatsApp'} *
            </Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder={placeholders.phoneNumber}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Configuração ativa</Label>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Instruções:</h4>
            {formData.provider === 'twilio' ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Crie uma conta em <strong>twilio.com</strong></p>
                <p>• Copie o Account SID e Auth Token do painel</p>
                <p>• Use um número Twilio válido (+5511999999999)</p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Crie uma conta em <strong>ultramsg.com</strong></p>
                <p>• Copie o Instance ID e Token da instância</p>
                <p>• Use seu número WhatsApp sem símbolos (5511999999999)</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (settings ? 'Atualizar' : 'Salvar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}