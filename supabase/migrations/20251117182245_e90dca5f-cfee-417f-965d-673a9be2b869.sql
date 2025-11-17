-- Criar tabela de configurações do salão
CREATE TABLE IF NOT EXISTS public.salon_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Meu Salão',
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  public_link TEXT NOT NULL UNIQUE,
  working_hours JSONB NOT NULL DEFAULT '{"monday":{"start":"08:00","end":"18:00","active":true},"tuesday":{"start":"08:00","end":"18:00","active":true},"wednesday":{"start":"08:00","end":"18:00","active":true},"thursday":{"start":"08:00","end":"18:00","active":true},"friday":{"start":"08:00","end":"18:00","active":true},"saturday":{"start":"08:00","end":"16:00","active":true},"sunday":{"start":"10:00","end":"14:00","active":false}}'::jsonb,
  address TEXT,
  phone TEXT,
  scheduling_interval INTEGER DEFAULT 30,
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications_enabled BOOLEAN DEFAULT true,
  document_type TEXT CHECK (document_type IN ('cpf', 'cnpj')),
  document_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitir leitura e escrita para todos autenticados)
CREATE POLICY "Allow all operations on salon_settings" ON public.salon_settings FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de funcionários
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pro_email TEXT UNIQUE NOT NULL,
  pro_password TEXT NOT NULL,
  telefone TEXT,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'SUBADMIN', 'RECEPCIONISTA', 'FUNCIONARIO', 'OUTRO')),
  custom_role_name TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  commission_type TEXT CHECK (commission_type IN ('fixed', 'percentage')),
  commission_value NUMERIC(10,2),
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow all operations on employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  telefone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  total_visits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de serviços
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow all operations on services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'concluido')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow all operations on appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de configurações de notificação
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  whatsapp_enabled BOOLEAN DEFAULT true,
  reminder_hours_before INTEGER DEFAULT 24,
  twilio_account_sid TEXT,
  twilio_auth_token TEXT,
  twilio_phone_number TEXT,
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_password TEXT,
  smtp_from_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow all operations on notification_settings" ON public.notification_settings FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de histórico de notificações
CREATE TABLE IF NOT EXISTS public.notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  status TEXT NOT NULL CHECK (status IN ('enviado', 'falhou', 'pendente')),
  recipient TEXT NOT NULL,
  message TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow all operations on notification_history" ON public.notification_history FOR ALL USING (true) WITH CHECK (true);

-- Criar bucket de storage para imagens do salão (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('salon-images', 'salon-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'salon-images');
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'salon-images');
CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE USING (bucket_id = 'salon-images');
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE USING (bucket_id = 'salon-images');

-- Inserir configurações padrão do salão
INSERT INTO public.salon_settings (name, public_link)
VALUES ('Meu Salão', substr(md5(random()::text), 1, 6))
ON CONFLICT DO NOTHING;

-- Criar usuário admin padrão (email: admin@barbershop.com, senha: admin123)
INSERT INTO public.employees (name, pro_email, pro_password, role, status)
VALUES ('Administrador', 'admin@barbershop.com', 'admin123', 'ADMIN', 'ativo')
ON CONFLICT (pro_email) DO NOTHING;