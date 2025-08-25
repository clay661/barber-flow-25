-- Inserir dados de exemplo para testar o dashboard com document_type null
INSERT INTO public.tenants (name, email, document_type, document_number, status) VALUES
('Salão da Maria', 'maria@salaodamaria.com', null, '12.345.678/0001-90', 'active'),
('Barbearia do João', 'joao@barbearia.com', null, '98.765.432/0001-12', 'active'),
('Estética Bella', 'contato@esteticabella.com', null, '11.222.333/0001-44', 'active'),
('Spa Relax', 'contato@sparelax.com', null, '55.666.777/0001-88', 'active')
ON CONFLICT (email) DO NOTHING;

-- Inserir funcionários de exemplo
INSERT INTO public.employees (name, telefone, pro_email, role, status) VALUES
('João Silva', '(11) 99999-1111', 'joao@empresa1.com', 'ADMIN', 'ativo'),
('Maria Santos', '(11) 99999-2222', 'maria@empresa2.com', 'FUNCIONARIO', 'ativo'),
('Pedro Costa', '(11) 99999-3333', 'pedro@empresa3.com', 'RECEPCIONISTA', 'ativo'),
('Ana Oliveira', '(11) 99999-4444', 'ana@empresa4.com', 'FUNCIONARIO', 'ativo'),
('Carlos Lima', '(11) 99999-5555', 'carlos@empresa5.com', 'SUBADMIN', 'ativo')
ON CONFLICT (pro_email) DO NOTHING;

-- Criar planos se não existirem
INSERT INTO public.subscription_plans (name, description, price_monthly, features, status) VALUES
('Básico', 'Plano básico para pequenos salões', 99.90, '{"max_employees": 5, "max_services": 20}', 'active'),
('Profissional', 'Plano profissional para salões médios', 199.90, '{"max_employees": 15, "max_services": 50}', 'active'),
('Premium', 'Plano premium para grandes estabelecimentos', 299.90, '{"max_employees": 50, "max_services": 100}', 'active')
ON CONFLICT (name) DO NOTHING;