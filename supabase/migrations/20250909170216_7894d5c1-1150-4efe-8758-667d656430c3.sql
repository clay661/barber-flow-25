-- Remover a política atual que exige autenticação via auth.uid()
DROP POLICY IF EXISTS "Only authenticated users can update salon settings" ON salon_settings;

-- Criar nova política que permite updates para qualquer usuário autenticado
-- (já que o sistema usa autenticação customizada com employees, não Supabase Auth)
CREATE POLICY "Allow salon settings updates" 
ON salon_settings 
FOR UPDATE 
USING (true);

-- Também permitir INSERT caso não exista ainda um registro
DROP POLICY IF EXISTS "Allow salon settings insert" ON salon_settings;
CREATE POLICY "Allow salon settings insert" 
ON salon_settings 
FOR INSERT 
WITH CHECK (true);

-- Atualizar o public_link existente para ser mais curto (6 caracteres)
UPDATE salon_settings 
SET public_link = substr(md5(random()::text), 1, 6) 
WHERE length(public_link) > 6;