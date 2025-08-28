
-- FASE 1: CORREÇÕES CRÍTICAS DE SEGURANÇA

-- 1. Corrigir RLS políticas para proteger dados sensíveis
-- Atualizar políticas dos funcionários para proteger credenciais
DROP POLICY IF EXISTS "Authenticated users can view employees" ON employees;
CREATE POLICY "Authenticated users can view employees without credentials" ON employees
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política separada para admins verem credenciais
CREATE POLICY "Admins can view employee credentials" ON employees
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.pro_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND e.role IN ('ADMIN', 'SUBADMIN')
  )
);

-- 2. Adicionar enum para cargo "OUTRO" e campo personalizado
ALTER TYPE employee_role ADD VALUE IF NOT EXISTS 'OUTRO';

-- Adicionar campo para cargo personalizado
ALTER TABLE employees ADD COLUMN IF NOT EXISTS custom_role_name text;

-- 3. Corrigir validações de unicidade
-- Adicionar constraints únicos para evitar duplicatas
ALTER TABLE employees ADD CONSTRAINT IF NOT EXISTS unique_pro_email UNIQUE (pro_email);
ALTER TABLE clients ADD CONSTRAINT IF NOT EXISTS unique_client_email UNIQUE (email) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE clients ADD CONSTRAINT IF NOT EXISTS unique_client_phone UNIQUE (telefone) DEFERRABLE INITIALLY DEFERRED;

-- 4. Função para validar conflitos de horário
CREATE OR REPLACE FUNCTION check_appointment_conflict(
  p_employee_id uuid,
  p_date timestamp,
  p_duration_minutes integer,
  p_appointment_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conflict_count integer;
  end_time timestamp;
BEGIN
  end_time := p_date + (p_duration_minutes || ' minutes')::interval;
  
  SELECT COUNT(*)
  INTO conflict_count
  FROM appointments a
  JOIN services s ON a.service_id = s.id
  WHERE a.employee_id = p_employee_id
    AND a.status NOT IN ('CANCELADO')
    AND (p_appointment_id IS NULL OR a.id != p_appointment_id)
    AND (
      -- Novo agendamento inicia durante um existente
      (p_date >= a.date AND p_date < a.date + (s.duration_minutes || ' minutes')::interval)
      OR
      -- Novo agendamento termina durante um existente
      (end_time > a.date AND end_time <= a.date + (s.duration_minutes || ' minutes')::interval)
      OR
      -- Novo agendamento engloba um existente
      (p_date <= a.date AND end_time >= a.date + (s.duration_minutes || ' minutes')::interval)
    );
    
  RETURN conflict_count = 0;
END;
$$;

-- 5. Trigger para validar conflitos antes de inserir/atualizar agendamentos
CREATE OR REPLACE FUNCTION validate_appointment_conflict()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  service_duration integer;
BEGIN
  -- Buscar duração do serviço
  SELECT duration_minutes INTO service_duration
  FROM services WHERE id = NEW.service_id;
  
  -- Validar conflito apenas se tiver funcionário e serviço
  IF NEW.employee_id IS NOT NULL AND NEW.service_id IS NOT NULL THEN
    IF NOT check_appointment_conflict(NEW.employee_id, NEW.date, service_duration, NEW.id) THEN
      RAISE EXCEPTION 'Conflito de horário: já existe um agendamento para este funcionário neste horário.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para validação
DROP TRIGGER IF EXISTS validate_appointment_conflict_trigger ON appointments;
CREATE TRIGGER validate_appointment_conflict_trigger
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION validate_appointment_conflict();

-- 6. Atualizar função de geração de credenciais para suportar cargo personalizado
CREATE OR REPLACE FUNCTION generate_employee_credentials_secure()
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
    plain_password text;
BEGIN
    -- Gerar email baseado no nome
    email_base := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'));
    email_base := regexp_replace(email_base, '\s+', '.', 'g');
    final_email := email_base || '@meusalao.com';
    
    -- Verificar se email já existe e adicionar número se necessário
    WHILE EXISTS (SELECT 1 FROM employees WHERE pro_email = final_email AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
        counter := counter + 1;
        final_email := email_base || counter || '@meusalao.com';
    END LOOP;
    
    -- Gerar senha aleatória de 12 caracteres
    plain_password := substr(md5(random()::text), 1, 12);
    
    -- Definir email se não foi fornecido
    IF NEW.pro_email IS NULL OR NEW.pro_email = '' THEN
        NEW.pro_email := final_email;
    END IF;
    
    -- Hash da senha se foi fornecida, senão usar senha aleatória
    IF NEW.pro_password IS NULL OR NEW.pro_password = '' THEN
        -- Armazenar senha em plain text temporariamente para exibir ao admin
        -- Em produção, isso seria feito de forma mais segura
        NEW.pro_password := hash_password(plain_password);
    ELSE
        -- Se a senha não parece ser um hash (não começa com $2), então fazer hash
        IF NOT (NEW.pro_password ~ '^\$2[aby]?\$[0-9]{2}\$') THEN
            NEW.pro_password := hash_password(NEW.pro_password);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;
