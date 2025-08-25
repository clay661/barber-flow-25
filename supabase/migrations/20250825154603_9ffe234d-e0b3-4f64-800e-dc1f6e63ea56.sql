-- Inserir dados de exemplo mais simples
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
  -- Buscar IDs
  SELECT id INTO tenant_id_1 FROM public.tenants WHERE email = 'maria@salaodamaria.com' LIMIT 1;
  SELECT id INTO tenant_id_2 FROM public.tenants WHERE email = 'joao@barbearia.com' LIMIT 1;
  SELECT id INTO tenant_id_3 FROM public.tenants WHERE email = 'contato@esteticabella.com' LIMIT 1;
  SELECT id INTO plan_id FROM public.subscription_plans WHERE name = 'Profissional' LIMIT 1;
  
  -- Inserir assinaturas apenas se não existirem
  IF tenant_id_1 IS NOT NULL AND plan_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE tenant_id = tenant_id_1) THEN
      INSERT INTO public.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end) 
      VALUES (tenant_id_1, plan_id, 'active', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days')
      RETURNING id INTO sub_id_1;
    ELSE
      SELECT id INTO sub_id_1 FROM public.subscriptions WHERE tenant_id = tenant_id_1 LIMIT 1;
    END IF;
  END IF;
  
  IF tenant_id_2 IS NOT NULL AND plan_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE tenant_id = tenant_id_2) THEN
      INSERT INTO public.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end) 
      VALUES (tenant_id_2, plan_id, 'active', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days')
      RETURNING id INTO sub_id_2;
    ELSE
      SELECT id INTO sub_id_2 FROM public.subscriptions WHERE tenant_id = tenant_id_2 LIMIT 1;
    END IF;
  END IF;
  
  IF tenant_id_3 IS NOT NULL AND plan_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE tenant_id = tenant_id_3) THEN
      INSERT INTO public.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end) 
      VALUES (tenant_id_3, plan_id, 'canceled', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days')
      RETURNING id INTO sub_id_3;
    ELSE
      SELECT id INTO sub_id_3 FROM public.subscriptions WHERE tenant_id = tenant_id_3 LIMIT 1;
    END IF;
  END IF;

  -- Inserir alguns pagamentos se não existirem
  IF sub_id_1 IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.payment_history WHERE subscription_id = sub_id_1) THEN
      INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
      VALUES (sub_id_1, 19990, 'BRL', 'succeeded', CURRENT_DATE - INTERVAL '5 days', 'pi_test_maria');
    END IF;
  END IF;
  
  IF sub_id_2 IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.payment_history WHERE subscription_id = sub_id_2) THEN
      INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
      VALUES (sub_id_2, 19990, 'BRL', 'succeeded', CURRENT_DATE - INTERVAL '3 days', 'pi_test_joao');
    END IF;
  END IF;
  
  IF sub_id_3 IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.payment_history WHERE subscription_id = sub_id_3) THEN
      INSERT INTO public.payment_history (subscription_id, amount, currency, status, payment_date, stripe_payment_intent_id)
      VALUES (sub_id_3, 19990, 'BRL', 'pending', CURRENT_DATE - INTERVAL '7 days', 'pi_test_bella');
    END IF;
  END IF;
  
END $$;