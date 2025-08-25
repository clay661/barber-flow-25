-- Adicionar campos para horários de funcionamento e configurações gerais na tabela salon_settings
ALTER TABLE public.salon_settings 
ADD COLUMN working_hours jsonb DEFAULT '{
  "monday": {"start": "08:00", "end": "18:00", "active": true},
  "tuesday": {"start": "08:00", "end": "18:00", "active": true},
  "wednesday": {"start": "08:00", "end": "18:00", "active": true},
  "thursday": {"start": "08:00", "end": "18:00", "active": true},
  "friday": {"start": "08:00", "end": "18:00", "active": true},
  "saturday": {"start": "08:00", "end": "16:00", "active": true},
  "sunday": {"start": "10:00", "end": "14:00", "active": false}
}'::jsonb,
ADD COLUMN address text,
ADD COLUMN phone text,
ADD COLUMN scheduling_interval integer DEFAULT 30,
ADD COLUMN notifications_enabled boolean DEFAULT true;