
-- Primeiro, vamos ver quais valores estão sendo usados atualmente
-- e depois ajustar a constraint para aceitar os valores corretos

-- Remover a constraint existente
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;

-- Adicionar nova constraint com os valores corretos em português
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'));
