-- Criar tabelas para os dados dos formulários do Super Admin

-- Tabela para cupons de desconto
CREATE TABLE public.discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para afiliados
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC DEFAULT 15,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_commission NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para configurações de segurança
CREATE TABLE public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  two_factor_enabled BOOLEAN DEFAULT false,
  last_password_change TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para Super Admin (acesso total)
CREATE POLICY "Super admin can do everything on discount_coupons" 
ON public.discount_coupons 
FOR ALL 
USING (true);

CREATE POLICY "Super admin can do everything on affiliates" 
ON public.affiliates 
FOR ALL 
USING (true);

CREATE POLICY "Super admin can do everything on security_settings" 
ON public.security_settings 
FOR ALL 
USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_discount_coupons_updated_at
  BEFORE UPDATE ON public.discount_coupons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at
  BEFORE UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO public.discount_coupons (code, type, value, usage_limit, used_count, start_date, end_date, status) VALUES
('DESCONTO20', 'percentage', 20, 100, 45, '2025-01-15', '2025-01-31', 'active'),
('PRIMEIRA30', 'percentage', 30, 50, 23, '2025-01-10', '2025-02-28', 'active'),
('NATAL50', 'fixed', 50, 200, 200, '2024-12-01', '2024-12-31', 'expired'),
('FRETE15', 'percentage', 15, NULL, 12, '2025-01-20', '2025-06-30', 'paused');

INSERT INTO public.affiliates (name, email, referral_code, total_clicks, total_conversions, total_commission, status) VALUES
('João Silva', 'joao.silva@email.com', 'joao123', 234, 18, 270.00, 'active'),
('Maria Santos', 'maria.santos@email.com', 'maria456', 189, 12, 180.00, 'active'),
('Carlos Lima', 'carlos.lima@email.com', 'carlos789', 56, 3, 45.00, 'paused');

INSERT INTO public.security_settings (two_factor_enabled, last_password_change) VALUES
(false, now());