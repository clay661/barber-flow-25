-- Corrigir função para definir search_path seguro
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;