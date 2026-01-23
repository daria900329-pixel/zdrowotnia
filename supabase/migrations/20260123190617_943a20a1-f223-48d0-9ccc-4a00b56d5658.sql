-- Add long_description column for product pages
ALTER TABLE public.products 
ADD COLUMN long_description text;