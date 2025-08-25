-- Criar assinaturas e pagamentos de exemplo
DO $$
DECLARE
  tenant_id_1 uuid;
  tenant_id_2 uuid;
  tenant_id_3 uuid;
  plan_id uuid;
  sub_id_1 uuid;
  sub_id_2 uuid;
  sub_id_3 uuid;
BEGIN
  -- Buscar IDs dos tenants
  SELECT id INTO tenant_id_1 FROM public.tenants WHERE email = 'maria@salaodamaria.com' LIMIT 1;
  SELECT id INTO tenant_id_2 FROM public.tenants WHERE email = 'joao@barbearia.com' LIMIT 1;
  SELECT id INTO tenant_id_3 FROM public.tenants WHERE email = 'contato@esteticabella.com' LIMIT 1;
  
  -- Buscar ID do plano
  SELECT id INTO plan_id FROM public.subscription_plans WHERE name = 'Profissional' LIMIT 1;
  
  -- Inserir assinaturas se os IDs existem
  IF tenant_id_1 IS NOT NULL AND plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id) 
    VALUES (tenant_id_1, plan_id, 'active', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days', 'cus_maria123', 'sub_maria123')
    ON CONFLICT (tenant_id) DO NOTHING
    RETURNING id INTO sub_id_1;
  END IF;
  
  IF tenant_id_2 IS NOT NULL AND plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id) 
    VALUES (tenant_id_2, plan_id, 'active', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days', 'cus_joao123', 'sub_joao123')
    ON CONFLICT (tenant_id) DO NOTHING
    RETURNING id INTO sub_id_2;
  END IF;
  
  IF tenant_id_3 IS NOT NULL AND plan_id IS NOT NULL THEN 
    INSERT INTO public.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id) 
    VALUES (tenant_id_3, plan_id, 'canceled', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days', 'cus_bella123', 'sub_bella123')
    ON CONFLICT (tenant_id) DO NOTHING
    RETURNING id INTO sub_id_3;
  END IF;

  -- Buscar IDs das assinaturas se não foram retornados (já existiam)
  IF sub_id_1 IS NULL THEN
    SELECT id INTO sub_id_1 FROM public.subscriptions WHERE tenant_id = tenant_id_1 LIMIT 1;
  END IF;
  
  IF sub_id_2 IS NULL THEN
    SELECT id INTO sub_id_2 FROM public.subscriptions WHERE tenant_id = tenant_id_2 LIMIT 1;
  END IF;
  
  IF sub_id_3 IS NULL THEN
    SELECT id INTO sub_id_3 FROM public.subscriptions WHERE tenant_id = tenant_id_3 LIMIT 1;
  END IF;

  -- Inserir pagamentos de exemplo
  IF sub_id_1 IS NOT NULL THEN
    INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
    VALUES 
      (sub_id_1, 19990, 'BRL', 'succeeded', CURRENT_DATE - INTERVAL '5 days', 'pi_maria_recent'),
      (sub_id_1, 19990, 'BRL', 'succeeded', CURRENT_DATE - INTERVAL '35 days', 'pi_maria_old')
    ON CONFLICT (stripe_payment_intent_id) DO NOTHING;
  END IF;
  
  IF sub_id_2 IS NOT NULL THEN
    INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
    VALUES 
      (sub_id_2, 19990, 'BRL', 'succeeded', CURRENT_DATE - INTERVAL '3 days', 'pi_joao_recent'),
      (sub_id_2, 19990, 'BRL', 'succeeded', CURRENT_DATE - INTERVAL '33 days', 'pi_joao_old')
    ON CONFLICT (stripe_payment_intent_id) DO NOTHING;
  END IF;
  
  IF sub_id_3 IS NOT NULL THEN
    INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
    VALUES 
      (sub_id_3, 19990, 'BRL', 'pending', CURRENT_DATE - INTERVAL '7 days', 'pi_bella_pending')
    ON CONFLICT (stripe_payment_intent_id) DO NOTHING;
  END IF;
  
END $$;