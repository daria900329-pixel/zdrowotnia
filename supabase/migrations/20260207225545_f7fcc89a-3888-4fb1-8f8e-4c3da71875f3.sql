-- Create table for product description sections with images
CREATE TABLE public.product_description_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  show_in_menu BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_description_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view product sections"
ON public.product_description_sections
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage product sections"
ON public.product_description_sections
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_product_description_sections_updated_at
BEFORE UPDATE ON public.product_description_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster queries
CREATE INDEX idx_product_description_sections_product_id 
ON public.product_description_sections(product_id, display_order);