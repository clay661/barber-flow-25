-- Inserir dados de exemplo simples (sem ON CONFLICT)
-- Verificar e inserir tenants
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE email = 'maria@salaodamaria.com') THEN
    INSERT INTO public.tenants (name, email, status) VALUES ('Salão da Maria', 'maria@salaodamaria.com', 'active');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE email = 'joao@barbearia.com') THEN
    INSERT INTO public.tenants (name, email, status) VALUES ('Barbearia do João', 'joao@barbearia.com', 'active');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE email = 'contato@esteticabella.com') THEN
    INSERT INTO public.tenants (name, email, status) VALUES ('Estética Bella', 'contato@esteticabella.com', 'active');
  END IF;

  -- Inserir funcionários
  IF NOT EXISTS (SELECT 1 FROM public.employees WHERE pro_email = 'joao@empresa1.com') THEN
    INSERT INTO public.employees (name, telefone, pro_email, role, status) VALUES ('João Silva', '(11) 99999-1111', 'joao@empresa1.com', 'ADMIN', 'ativo');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.employees WHERE pro_email = 'maria@empresa2.com') THEN
    INSERT INTO public.employees (name, telefone, pro_email, role, status) VALUES ('Maria Santos', '(11) 99999-2222', 'maria@empresa2.com', 'FUNCIONARIO', 'ativo');
  END IF;

  -- Inserir planos
  IF NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE name = 'Básico') THEN
    INSERT INTO public.subscription_plans (name, description, price_monthly, features, status) VALUES ('Básico', 'Plano básico para pequenos salões', 99.90, '{"max_employees": 5, "max_services": 20}', 'active');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE name = 'Profissional') THEN
    INSERT INTO public.subscription_plans (name, description, price_monthly, features, status) VALUES ('Profissional', 'Plano profissional para salões médios', 199.90, '{"max_employees": 15, "max_services": 50}', 'active');
  END IF;
END $$;