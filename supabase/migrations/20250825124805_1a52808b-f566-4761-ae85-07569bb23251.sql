-- Adicionar campos de e-mail na tabela notification_settings
ALTER TABLE public.notification_settings 
ADD COLUMN notification_mode text NOT NULL DEFAULT 'sms_whatsapp' CHECK (notification_mode IN ('sms_whatsapp', 'email', 'both')),
ADD COLUMN smtp_host text,
ADD COLUMN smtp_port integer,
ADD COLUMN smtp_user text,
ADD COLUMN smtp_password text,
ADD COLUMN from_email text;