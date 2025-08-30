
-- Desabilitar RLS temporariamente para permitir operações sem autenticação Supabase
-- ou ajustar as políticas para permitir inserções baseadas em outros critérios

-- Para a tabela clients
DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;

-- Criar políticas mais permissivas para clients
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true);

-- Para a tabela employees
DROP POLICY IF EXISTS "Authenticated users can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can update employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can delete employees" ON public.employees;

-- Criar políticas mais permissivas para employees
CREATE POLICY "Allow all operations on employees" ON public.employees FOR ALL USING (true);

-- Para a tabela appointments
DROP POLICY IF EXISTS "Authenticated users can insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON public.appointments;

-- Criar políticas mais permissivas para appointments
CREATE POLICY "Allow all operations on appointments" ON public.appointments FOR ALL USING (true);

-- Para a tabela services (manter a política existente para visualização pública, mas ajustar as outras)
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;

-- Criar política mais permissiva para services (mantendo a visualização pública)
CREATE POLICY "Allow all operations on services" ON public.services FOR ALL USING (true);
