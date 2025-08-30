
-- Habilitar a extensão pgcrypto para funções de hash
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recriar a função hash_password com a sintaxe correta
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN crypt(password, gen_salt('bf', 12));
END;
$function$;

-- Verificar se o trigger existe e recriá-lo se necessário
DROP TRIGGER IF EXISTS generate_employee_credentials ON public.employees;

CREATE TRIGGER generate_employee_credentials
  BEFORE INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_employee_credentials_secure();
