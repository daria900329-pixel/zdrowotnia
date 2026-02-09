ALTER TABLE public.about_gallery ADD COLUMN is_hero boolean NOT NULL DEFAULT false;

-- Set the existing image as hero
UPDATE public.about_gallery SET is_hero = true WHERE id = '488f56ba-ca82-4d95-83cf-ed16e0689e39';