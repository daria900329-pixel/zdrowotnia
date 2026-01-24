-- Add promo_price column to product_variants for promotional pricing
ALTER TABLE public.product_variants 
ADD COLUMN promo_price numeric NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.product_variants.promo_price IS 'Promotional price - when set, displays as discounted price with original price crossed out';