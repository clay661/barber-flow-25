-- Criar tabela para configurações de notificação
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('twilio', 'ultramsg')),
  api_key_sid TEXT NOT NULL,
  auth_token TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de notificações
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  client_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
  provider_response JSONB,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- Políticas para notification_settings (apenas admins podem acessar)
CREATE POLICY "Only authenticated users can view notification settings"
ON notification_settings FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert notification settings"
ON notification_settings FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update notification settings"
ON notification_settings FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete notification settings"
ON notification_settings FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Políticas para notification_history (apenas leitura para usuários autenticados)
CREATE POLICY "Only authenticated users can view notification history"
ON notification_history FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert notification history"
ON notification_history FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Função para atualizar o updated_at em notification_settings
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar updated_at em notification_settings
CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_settings_updated_at();