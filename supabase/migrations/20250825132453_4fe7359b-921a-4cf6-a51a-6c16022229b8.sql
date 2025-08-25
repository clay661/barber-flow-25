-- Add commission fields to employees table
ALTER TABLE public.employees 
ADD COLUMN commission_type text DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed')),
ADD COLUMN commission_value numeric(10,2) DEFAULT 0;

-- Add email notifications setting to salon_settings
ALTER TABLE public.salon_settings 
ADD COLUMN email_notifications_enabled boolean DEFAULT true;

-- Update existing salon settings to include email notifications
UPDATE public.salon_settings 
SET email_notifications_enabled = true 
WHERE email_notifications_enabled IS NULL;