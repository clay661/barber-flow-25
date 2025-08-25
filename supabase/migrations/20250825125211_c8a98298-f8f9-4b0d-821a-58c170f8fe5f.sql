-- Corrigir todas as funções restantes para usar search_path imutável

-- Atualizar função update_salon_settings_updated_at
CREATE OR REPLACE FUNCTION public.update_salon_settings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Atualizar função update_notification_settings_updated_at  
CREATE OR REPLACE FUNCTION public.update_notification_settings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;