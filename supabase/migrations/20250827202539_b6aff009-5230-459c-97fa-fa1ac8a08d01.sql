-- CORREÇÃO DE SEGURANÇA - Parte 1: Corrigir dependências e implementar RLS

-- 1. Primeiro dropar trigger existente
DROP TRIGGER IF EXISTS generate_credentials_trigger ON public.employees;

-- 2. Agora posso dropar a função
DROP FUNCTION IF EXISTS public.generate_employee_credentials();

-- 3. CORRIGIR clients table - proteger dados pessoais de clientes
DROP POLICY IF EXISTS "Permitir todas operações em clients" ON public.clients;

CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update clients" ON public.clients
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete clients" ON public.clients
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. CORRIGIR employees table - proteger credenciais de funcionários
DROP POLICY IF EXISTS "Permitir todas operações em employees" ON public.employees;

CREATE POLICY "Authenticated users can view employees" ON public.employees
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert employees" ON public.employees
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update employees" ON public.employees
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete employees" ON public.employees
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5. CORRIGIR appointments table - proteger agendamentos
DROP POLICY IF EXISTS "Permitir todas operações em appointments" ON public.appointments;

CREATE POLICY "Authenticated users can view appointments" ON public.appointments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete appointments" ON public.appointments
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 6. CORRIGIR services table - proteger serviços
DROP POLICY IF EXISTS "Permitir todas operações em services" ON public.services;

CREATE POLICY "Anyone can view active services for public booking" ON public.services
  FOR SELECT USING (status = 'ativo');

CREATE POLICY "Authenticated users can manage services" ON public.services
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 7. Implementar extensão para hash de senhas
CREATE EXTENSION IF NOT EXISTS pgcrypto;