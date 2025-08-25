-- Inserir dados de exemplo para testar o dashboard
-- Primeiro, inserir alguns dados de tenants de exemplo
INSERT INTO public.tenants (name, email, document_type, document_number, status) VALUES
('Salão da Maria', 'maria@salaodamaria.com', 'CNPJ', '12.345.678/0001-90', 'active'),
('Barbearia do João', 'joao@barbearia.com', 'CNPJ', '98.765.432/0001-12', 'active'),
('Estética Bella', 'contato@esteticabella.com', 'CNPJ', '11.222.333/0001-44', 'active'),
('Spa Relax', 'contato@sparelax.com', 'CNPJ', '55.666.777/0001-88', 'active')
ON CONFLICT (email) DO NOTHING;

-- Inserir alguns funcionários de exemplo
INSERT INTO public.employees (name, telefone, pro_email, role, status) VALUES
('João Silva', '(11) 99999-1111', 'joao@empresa1.com', 'ADMIN', 'ativo'),
('Maria Santos', '(11) 99999-2222', 'maria@empresa2.com', 'FUNCIONARIO', 'ativo'),
('Pedro Costa', '(11) 99999-3333', 'pedro@empresa3.com', 'RECEPCIONISTA', 'ativo'),
('Ana Oliveira', '(11) 99999-4444', 'ana@empresa4.com', 'FUNCIONARIO', 'ativo'),
('Carlos Lima', '(11) 99999-5555', 'carlos@empresa5.com', 'SUBADMIN', 'ativo')
ON CONFLICT (pro_email) DO NOTHING;

-- Criar alguns planos de assinatura de exemplo se não existirem
INSERT INTO public.subscription_plans (name, description, price_monthly, features, status) VALUES
('Básico', 'Plano básico para pequenos salões', 99.90, '{"max_employees": 5, "max_services": 20}', 'active'),
('Profissional', 'Plano profissional para salões médios', 199.90, '{"max_employees": 15, "max_services": 50}', 'active'),
('Premium', 'Plano premium para grandes estabelecimentos', 299.90, '{"max_employees": 50, "max_services": 100}', 'active')
ON CONFLICT (name) DO NOTHING;

-- Inserir algumas assinaturas de exemplo
INSERT INTO public.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id) 
SELECT 
  t.id as tenant_id,
  p.id as plan_id,
  CASE 
    WHEN t.name = 'Estética Bella' THEN 'canceled'
    ELSE 'active'
  END as status,
  CURRENT_DATE - INTERVAL '30 days' as current_period_start,
  CURRENT_DATE + INTERVAL '30 days' as current_period_end,
  'cus_' || SUBSTR(MD5(t.email), 1, 14) as stripe_customer_id,
  'sub_' || SUBSTR(MD5(t.email), 1, 14) as stripe_subscription_id
FROM public.tenants t
CROSS JOIN public.subscription_plans p
WHERE p.name = 'Profissional'
ON CONFLICT (tenant_id) DO NOTHING;

-- Inserir histórico de pagamentos de exemplo
INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
SELECT 
  s.id as subscription_id,
  p.price_monthly * 100 as amount, -- Convertendo para centavos
  'BRL' as currency,
  CASE 
    WHEN s.status = 'canceled' THEN 'failed'
    WHEN RANDOM() > 0.8 THEN 'pending'
    ELSE 'succeeded'
  END as status,
  CURRENT_DATE - (RANDOM() * 30)::INTEGER as payment_date,
  'pi_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 14) as stripe_payment_intent_id
FROM public.subscriptions s
JOIN public.subscription_plans p ON s.plan_id = p.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.payment_history ph WHERE ph.subscription_id = s.id
);

-- Inserir mais alguns pagamentos históricos para simular dados
INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
SELECT DISTINCT
  s.id as subscription_id,
  p.price_monthly * 100 as amount,
  'BRL' as currency,
  'succeeded' as status,
  CURRENT_DATE - (30 + (RANDOM() * 60)::INTEGER) as payment_date,
  'pi_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 14) as stripe_payment_intent_id
FROM public.subscriptions s
JOIN public.subscription_plans p ON s.plan_id = p.id
WHERE s.status = 'active';