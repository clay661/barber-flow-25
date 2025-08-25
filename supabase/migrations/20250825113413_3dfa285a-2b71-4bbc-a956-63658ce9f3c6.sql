-- Criar enum para roles de funcionários
CREATE TYPE employee_role AS ENUM ('ADMIN', 'SUBADMIN', 'FUNCIONARIO', 'RECEPCIONISTA');

-- Alterar tabela employees para usar o novo enum e ajustar campos
ALTER TABLE employees 
DROP COLUMN IF EXISTS role,
ADD COLUMN role employee_role DEFAULT 'FUNCIONARIO',
ADD COLUMN status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));

-- Ajustar tabela clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
ADD COLUMN IF NOT EXISTS total_visits integer DEFAULT 0;

-- Ajustar tabela services  
ALTER TABLE services
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Geral',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));

-- Ajustar tabela appointments
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS total_price numeric;

-- Habilitar RLS em todas as tabelas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes (acesso público para facilitar o desenvolvimento inicial)
CREATE POLICY "Permitir todas operações em clients" ON clients FOR ALL USING (true) WITH CHECK (true);

-- Políticas RLS para funcionários
CREATE POLICY "Permitir todas operações em employees" ON employees FOR ALL USING (true) WITH CHECK (true);

-- Políticas RLS para serviços
CREATE POLICY "Permitir todas operações em services" ON services FOR ALL USING (true) WITH CHECK (true);

-- Políticas RLS para agendamentos
CREATE POLICY "Permitir todas operações em appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);

-- Função para gerar email e senha automaticamente
CREATE OR REPLACE FUNCTION generate_employee_credentials()
RETURNS TRIGGER AS $$
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
    
    -- Gerar senha aleatória de 8 caracteres
    random_password := substr(md5(random()::text), 1, 8);
    
    -- Definir email e senha se não foram fornecidos
    IF NEW.pro_email IS NULL OR NEW.pro_email = '' THEN
        NEW.pro_email := final_email;
    END IF;
    
    IF NEW.pro_password IS NULL OR NEW.pro_password = '' THEN
        NEW.pro_password := random_password;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para gerar credenciais automaticamente
DROP TRIGGER IF EXISTS generate_credentials_trigger ON employees;
CREATE TRIGGER generate_credentials_trigger
    BEFORE INSERT ON employees
    FOR EACH ROW
    EXECUTE FUNCTION generate_employee_credentials();