
-- Adicionar 'OUTRO' ao enum employee_role existente
ALTER TYPE employee_role ADD VALUE IF NOT EXISTS 'OUTRO';

-- Verificar se a coluna custom_role_name já existe, se não, adicionar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' 
        AND column_name = 'custom_role_name'
    ) THEN
        ALTER TABLE employees ADD COLUMN custom_role_name text;
    END IF;
END $$;
