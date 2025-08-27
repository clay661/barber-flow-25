-- CORREÇÃO DE SEGURANÇA - Parte 2: Implementar hash de senhas e 2FA

-- 1. Implementar funções para hash de senhas com bcrypt
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 12));
END;
$$;

-- 2. Função para verificar senhas
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, hash) = hash;
END;
$$;

-- 3. Criar nova função segura para credentials de funcionários
CREATE OR REPLACE FUNCTION public.generate_employee_credentials_secure()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    email_base text;
    random_password text;
    counter integer := 0;
    final_email text;
BEGIN
    -- Gerar email baseado no nome
    email_base := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'));
    email_base := regexp_replace(email_base, '\s+', '.', 'g');
    final_email := email_base || '@meusalon.com';
    
    -- Verificar se email já existe e adicionar número se necessário
    WHILE EXISTS (SELECT 1 FROM employees WHERE pro_email = final_email) LOOP
        counter := counter + 1;
        final_email := email_base || counter || '@meusalon.com';
    END LOOP;
    
    -- Gerar senha aleatória de 16 caracteres
    random_password := encode(gen_random_bytes(12), 'base64');
    random_password := regexp_replace(random_password, '[^a-zA-Z0-9]', '', 'g');
    random_password := substr(random_password, 1, 16);
    
    -- Definir email se não foi fornecido
    IF NEW.pro_email IS NULL OR NEW.pro_email = '' THEN
        NEW.pro_email := final_email;
    END IF;
    
    -- Hash da senha se foi fornecida, senão usar senha aleatória
    IF NEW.pro_password IS NULL OR NEW.pro_password = '' THEN
        NEW.pro_password := hash_password(random_password);
    ELSE
        -- Se a senha não parece ser um hash (não começa com $2), então fazer hash
        IF NOT (NEW.pro_password ~ '^\$2[aby]?\$[0-9]{2}\$') THEN
            NEW.pro_password := hash_password(NEW.pro_password);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 4. Criar trigger seguro para employees
CREATE TRIGGER generate_employee_credentials_secure_trigger
    BEFORE INSERT OR UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_employee_credentials_secure();

-- 5. Hashear senhas existentes de super_admins
UPDATE public.super_admins 
SET password_hash = hash_password(password_hash) 
WHERE NOT (password_hash ~ '^\$2[aby]?\$[0-9]{2}\$');

-- 6. Hashear senhas existentes de employees
UPDATE public.employees 
SET pro_password = hash_password(pro_password) 
WHERE pro_password IS NOT NULL 
AND NOT (pro_password ~ '^\$2[aby]?\$[0-9]{2}\$');

-- 7. Criar tabela para 2FA
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('super_admin', 'employee')),
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, user_type)
);

ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own 2FA" ON public.two_factor_auth
  FOR ALL USING (
    (user_type = 'super_admin' AND user_id IN (
      SELECT id FROM super_admins WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )) OR
    (user_type = 'employee' AND user_id IN (
      SELECT id FROM employees WHERE pro_email = current_setting('request.jwt.claims', true)::json->>'email'
    ))
  );

-- 8. Trigger para updated_at na tabela 2FA
CREATE TRIGGER update_two_factor_auth_updated_at
  BEFORE UPDATE ON public.two_factor_auth
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();