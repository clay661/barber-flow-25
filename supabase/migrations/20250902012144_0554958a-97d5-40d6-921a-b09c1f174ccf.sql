
-- Criar função para hash de senha usando bcrypt
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- Usar crypt com bcrypt (identificador '$2a$')
  RETURN crypt(password, gen_salt('bf'));
END;
$$;

-- Criar função para verificar senha
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN crypt(password, hash) = hash;
END;
$$;

-- Criar trigger para auto-hash da senha ao inserir funcionário
CREATE OR REPLACE FUNCTION hash_employee_password()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se pro_password foi fornecido, fazer hash
  IF NEW.pro_password IS NOT NULL THEN
    NEW.pro_password = hash_password(NEW.pro_password);
  END IF;
  
  -- Se pro_email não foi fornecido, gerar automaticamente
  IF NEW.pro_email IS NULL OR NEW.pro_email = '' THEN
    NEW.pro_email = LOWER(REPLACE(NEW.name, ' ', '.')) || '@empresa.com';
  END IF;
  
  -- Se pro_password não foi fornecido, gerar senha padrão
  IF NEW.pro_password IS NULL OR NEW.pro_password = '' THEN
    NEW.pro_password = hash_password('123456');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para executar antes de inserir
DROP TRIGGER IF EXISTS trigger_hash_employee_password ON employees;
CREATE TRIGGER trigger_hash_employee_password
  BEFORE INSERT ON employees
  FOR EACH ROW
  EXECUTE FUNCTION hash_employee_password();

-- Criar trigger para hash de senha ao atualizar (se senha for alterada)
CREATE OR REPLACE FUNCTION hash_employee_password_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se pro_password foi alterado e não está já em hash, fazer hash
  IF NEW.pro_password IS NOT NULL AND NEW.pro_password != OLD.pro_password THEN
    -- Verificar se não é já um hash (hashes bcrypt começam com $2)
    IF NOT (NEW.pro_password ~ '^\$2[axy]?\$') THEN
      NEW.pro_password = hash_password(NEW.pro_password);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para executar antes de atualizar
DROP TRIGGER IF EXISTS trigger_hash_employee_password_update ON employees;
CREATE TRIGGER trigger_hash_employee_password_update
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION hash_employee_password_update();
