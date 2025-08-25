-- Add CPF/CNPJ fields to salon_settings table
ALTER TABLE public.salon_settings 
ADD COLUMN document_type text CHECK (document_type IN ('cpf', 'cnpj')),
ADD COLUMN document_number text;