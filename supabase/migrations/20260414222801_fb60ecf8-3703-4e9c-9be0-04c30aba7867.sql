
-- Enums
CREATE TYPE public.employee_role AS ENUM ('ADMIN', 'SUBADMIN', 'FUNCIONARIO', 'RECEPCIONISTA', 'OUTRO');
CREATE TYPE public.booking_status AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO');
CREATE TYPE public.commission_type AS ENUM ('percentage', 'fixed');

-- Employees
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pro_email TEXT UNIQUE NOT NULL,
  pro_password TEXT NOT NULL,
  telefone TEXT,
  role employee_role NOT NULL DEFAULT 'FUNCIONARIO',
  custom_role_name TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  commission_type commission_type DEFAULT 'percentage',
  commission_value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  total_visits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  date TIMESTAMPTZ NOT NULL,
  status booking_status NOT NULL DEFAULT 'PENDENTE',
  notes TEXT,
  total_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Salon Settings
CREATE TABLE public.salon_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Meu Salão',
  phone TEXT,
  address TEXT,
  opening_time TEXT DEFAULT '08:00',
  closing_time TEXT DEFAULT '18:00',
  scheduling_interval INTEGER DEFAULT 30,
  working_days INTEGER[] DEFAULT '{1,2,3,4,5,6}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tenants
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment History
CREATE TABLE public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification Settings
CREATE TABLE public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  whatsapp_enabled BOOLEAN DEFAULT false,
  reminder_hours_before INTEGER DEFAULT 24,
  email_template TEXT,
  sms_template TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notification History
CREATE TABLE public.notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
CREATE POLICY "Allow all for employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for salon_settings" ON public.salon_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for tenants" ON public.tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for payment_history" ON public.payment_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for notification_settings" ON public.notification_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for notification_history" ON public.notification_history FOR ALL USING (true) WITH CHECK (true);

-- Password hash trigger
CREATE OR REPLACE FUNCTION public.hash_employee_password()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pro_password IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.pro_password IS DISTINCT FROM OLD.pro_password) THEN
    NEW.pro_password := extensions.crypt(NEW.pro_password, extensions.gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER hash_password_trigger
BEFORE INSERT OR UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.hash_employee_password();

-- Verify password function
CREATE OR REPLACE FUNCTION public.verify_employee_password(p_email TEXT, p_password TEXT)
RETURNS UUID AS $$
DECLARE
  emp_id UUID;
BEGIN
  SELECT id INTO emp_id FROM public.employees
  WHERE pro_email = p_email AND pro_password = extensions.crypt(p_password, pro_password);
  RETURN emp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Insert admin
INSERT INTO public.employees (name, pro_email, pro_password, role, status)
VALUES ('Administrador', 'admin@barberflow.com', 'admin123', 'ADMIN', 'ativo');

-- Insert sample services
INSERT INTO public.services (name, price, duration_minutes, category) VALUES
('Corte Masculino', 45, 30, 'Corte'),
('Barba', 30, 20, 'Barba'),
('Corte + Barba', 65, 45, 'Combo'),
('Hidratação', 50, 40, 'Tratamento'),
('Platinado', 120, 90, 'Coloração');

-- Insert sample clients
INSERT INTO public.clients (name, telefone, email) VALUES
('João Silva', '11999990001', 'joao@email.com'),
('Pedro Santos', '11999990002', 'pedro@email.com'),
('Lucas Oliveira', '11999990003', 'lucas@email.com');

-- Insert default salon settings
INSERT INTO public.salon_settings (name, phone, address) VALUES
('BarberFlow Studio', '11999999999', 'Rua Principal, 123');
