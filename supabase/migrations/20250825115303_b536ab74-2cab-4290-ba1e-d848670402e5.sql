-- Create salon_settings table
CREATE TABLE public.salon_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Meu Salão',
  logo_url TEXT,
  banner_url TEXT,
  public_link TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;

-- Insert initial settings row
INSERT INTO public.salon_settings (name) VALUES ('Meu Salão');

-- Create policies
CREATE POLICY "Anyone can view salon settings for public booking"
ON public.salon_settings
FOR SELECT
USING (true);

CREATE POLICY "Only authenticated users can update salon settings"
ON public.salon_settings
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_salon_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_salon_settings_updated_at
BEFORE UPDATE ON public.salon_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_salon_settings_updated_at();

-- Create storage bucket for salon images
INSERT INTO storage.buckets (id, name, public) VALUES ('salon-images', 'salon-images', true);

-- Create storage policies for salon images
CREATE POLICY "Anyone can view salon images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'salon-images');

CREATE POLICY "Authenticated users can upload salon images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'salon-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update salon images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'salon-images' AND auth.uid() IS NOT NULL);