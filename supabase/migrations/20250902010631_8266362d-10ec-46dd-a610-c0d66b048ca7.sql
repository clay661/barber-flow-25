
-- Atualizar o role da conta korealuhe@gmail.com para ADMIN
UPDATE public.employees 
SET role = 'ADMIN'::employee_role 
WHERE pro_email = 'korealuhe@gmail.com';
