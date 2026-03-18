
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  telefone TEXT,
  role employee_role NOT NULL DEFAULT 'FUNCIONARIO',
  custom_role_name TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  pro_email TEXT UNIQUE,
  pro_password TEXT,
  commission_type commission_type NOT NULL DEFAULT 'percentage',
  commission_value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  total_visits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Geral',
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDENTE',
  notes TEXT,
  total_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Salon settings table
CREATE TABLE public.salon_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Meu Salão',
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  public_link TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 6),
  working_hours JSONB DEFAULT '{"monday":{"start":"08:00","end":"18:00","active":true},"tuesday":{"start":"08:00","end":"18:00","active":true},"wednesday":{"start":"08:00","end":"18:00","active":true},"thursday":{"start":"08:00","end":"18:00","active":true},"friday":{"start":"08:00","end":"18:00","active":true},"saturday":{"start":"08:00","end":"16:00","active":true},"sunday":{"start":"10:00","end":"14:00","active":false}}'::jsonb,
  address TEXT,
  phone TEXT,
  scheduling_interval INTEGER DEFAULT 30,
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications_enabled BOOLEAN DEFAULT true,
  document_type TEXT,
  document_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Notification settings table
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'twilio',
  api_key_sid TEXT NOT NULL DEFAULT '',
  auth_token TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT false,
  notification_mode TEXT NOT NULL DEFAULT 'sms_whatsapp',
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_password TEXT,
  from_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Notification history table
CREATE TABLE public.notification_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_response JSONB,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Super admins table
CREATE TABLE public.super_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  document_type TEXT,
  document_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC NOT NULL DEFAULT 0,
  price_yearly NUMERIC,
  features JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  stripe_price_id TEXT,
  trial_days INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Payment history table
CREATE TABLE public.payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. Discount coupons table
CREATE TABLE public.discount_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'percentage',
  value NUMERIC NOT NULL DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. Affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'active',
  total_clicks INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  total_commission NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. SaaS settings table
CREATE TABLE public.saas_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'BarberFlow',
  logo_url TEXT,
  sender_email TEXT,
  resend_api_key TEXT,
  stripe_publishable_key TEXT,
  stripe_secret_key TEXT,
  sms_provider_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 16. Security settings table
CREATE TABLE public.security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  last_password_change TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verify_password function
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN hash = crypt(password, hash);
END;
$$;

-- Create trigger to auto-hash passwords for employees
CREATE OR REPLACE FUNCTION public.hash_employee_password()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.pro_password IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.pro_password IS DISTINCT FROM OLD.pro_password) THEN
    NEW.pro_password := crypt(NEW.pro_password, gen_salt('bf'));
  END IF;
  IF NEW.pro_email IS NULL THEN
    NEW.pro_email := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]', '', 'g')) || '@barberflow.com';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER hash_employee_password_trigger
  BEFORE INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_employee_password();

-- Create trigger to auto-hash passwords for super_admins
CREATE OR REPLACE FUNCTION public.hash_super_admin_password()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.password_hash IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.password_hash IS DISTINCT FROM OLD.password_hash) THEN
    NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER hash_super_admin_password_trigger
  BEFORE INSERT OR UPDATE ON public.super_admins
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_super_admin_password();

-- Enable RLS and add permissive policies (custom auth, not Supabase Auth)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.salon_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.notification_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.notification_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.super_admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.subscription_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.payment_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.discount_coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.affiliates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.saas_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.security_settings FOR ALL USING (true) WITH CHECK (true);
