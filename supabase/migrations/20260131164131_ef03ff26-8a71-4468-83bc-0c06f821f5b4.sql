-- Add media_type column to distinguish images from videos
ALTER TABLE public.about_gallery 
ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video'));