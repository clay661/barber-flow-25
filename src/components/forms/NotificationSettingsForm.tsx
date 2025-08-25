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
    notification_mode: 'sms_whatsapp' as 'sms_whatsapp' | 'email' | 'both',
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        provider: settings.provider,
        api_key_sid: settings.api_key_sid,
        auth_token: settings.auth_token,
        phone_number: settings.phone_number,
        is_active: settings.is_active,
        notification_mode: settings.notification_mode || 'sms_whatsapp',
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || 587,
        smtp_user: settings.smtp_user || '',
        smtp_password: settings.smtp_password || '',
        from_email: settings.from_email || '',
      });
    } else {
      setFormData({
        provider: 'twilio',
        api_key_sid: '',
        auth_token: '',
        phone_number: '',
        is_active: true,
        notification_mode: 'sms_whatsapp',
        smtp_host: '',
        smtp_port: 587,
        smtp_user: '',
        smtp_password: '',
        from_email: '',
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
            Configure as credenciais para envio automático de notificações por SMS, WhatsApp e/ou E-mail.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification_mode">Modo de Notificação *</Label>
            <Select
              value={formData.notification_mode}
              onValueChange={(value: 'sms_whatsapp' | 'email' | 'both') => 
                setFormData({ ...formData, notification_mode: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms_whatsapp">Somente WhatsApp/SMS</SelectItem>
                <SelectItem value="email">Somente E-mail</SelectItem>
                <SelectItem value="both">E-mail + WhatsApp/SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.notification_mode === 'sms_whatsapp' || formData.notification_mode === 'both') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="provider">Provedor SMS/WhatsApp *</Label>
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
                  required={formData.notification_mode === 'sms_whatsapp' || formData.notification_mode === 'both'}
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
                  required={formData.notification_mode === 'sms_whatsapp' || formData.notification_mode === 'both'}
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
                  required={formData.notification_mode === 'sms_whatsapp' || formData.notification_mode === 'both'}
                />
              </div>
            </>
          )}

          {(formData.notification_mode === 'email' || formData.notification_mode === 'both') && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-blue-900">Configurações SMTP</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="from_email">E-mail Remetente *</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={formData.from_email}
                    onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                    placeholder="noreply@meusalao.com"
                    required={formData.notification_mode === 'email' || formData.notification_mode === 'both'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp_host">Servidor SMTP *</Label>
                  <Input
                    id="smtp_host"
                    value={formData.smtp_host}
                    onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
                    placeholder="smtp.gmail.com ou smtp.sendgrid.net"
                    required={formData.notification_mode === 'email' || formData.notification_mode === 'both'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp_port">Porta SMTP *</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={formData.smtp_port}
                    onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) || 587 })}
                    placeholder="587"
                    required={formData.notification_mode === 'email' || formData.notification_mode === 'both'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp_user">Usuário SMTP *</Label>
                  <Input
                    id="smtp_user"
                    value={formData.smtp_user}
                    onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
                    placeholder="seu-email@gmail.com"
                    required={formData.notification_mode === 'email' || formData.notification_mode === 'both'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp_password">Senha/Token SMTP *</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={formData.smtp_password}
                    onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                    placeholder="Senha ou token de aplicativo"
                    required={formData.notification_mode === 'email' || formData.notification_mode === 'both'}
                  />
                </div>
              </div>
            </>
          )}

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
            {formData.notification_mode === 'email' || formData.notification_mode === 'both' ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• <strong>Gmail:</strong> smtp.gmail.com:587 (use senha de aplicativo)</p>
                <p>• <strong>SendGrid:</strong> smtp.sendgrid.net:587</p>
                <p>• <strong>Outros:</strong> Consulte seu provedor de e-mail</p>
              </div>
            ) : null}
            {(formData.notification_mode === 'sms_whatsapp' || formData.notification_mode === 'both') && formData.provider === 'twilio' ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Crie uma conta em <strong>twilio.com</strong></p>
                <p>• Copie o Account SID e Auth Token do painel</p>
                <p>• Use um número Twilio válido (+5511999999999)</p>
              </div>
            ) : null}
            {(formData.notification_mode === 'sms_whatsapp' || formData.notification_mode === 'both') && formData.provider === 'ultramsg' ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Crie uma conta em <strong>ultramsg.com</strong></p>
                <p>• Copie o Instance ID e Token da instância</p>
                <p>• Use seu número WhatsApp sem símbolos (5511999999999)</p>
              </div>
            ) : null}
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