-- Create table for about page gallery images
CREATE TABLE public.about_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_gallery ENABLE ROW LEVEL SECURITY;

-- Anyone can view active gallery images
CREATE POLICY "Anyone can view active gallery images"
ON public.about_gallery
FOR SELECT
USING (is_active = true);

-- Admins can manage gallery images
CREATE POLICY "Admins can manage gallery images"
ON public.about_gallery
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add about_page content to site_content if not exists
INSERT INTO site_content (section_key, content) 
VALUES ('about_page', '{
  "hero_title": "Witaj w naszym domu! 🏡",
  "hero_badge": "Nasza Historia",
  "hero_paragraph1": "Jesteśmy zwykłą rodziną, która odkryła magię domowego jedzenia. To, co zaczęło się jako pasja — fermentacja pierwszej kombuchy w kuchni — dziś stało się sposobem życia, którym chcemy się dzielić.",
  "story_title": "Nasza Droga do Zdrowotni",
  "story_paragraph1": "Króliki hodujemy sami, chleb pieczyemy na zakwasie, który ma już ponad 3 lata!",
  "story_paragraph2": "Wszystko zaczęło się od prostej potrzeby — chcieliśmy wiedzieć, co jemy. Zmęczeni listami składników, których nie potrafimy wymówić, postanowiliśmy wrócić do korzeni.",
  "story_paragraph3": "Dziś nasza kuchnia to prawdziwa manufaktura. Fermentujemy, kisimy, wędzimy i pieczemy — wszystko według tradycyjnych receptur.",
  "story_highlight": "✨ Wierzymy, że dobre jedzenie łączy ludzi. Zapraszamy Cię do naszego stołu!",
  "timeline_title": "Nasza Historia",
  "timeline_subtitle": "Od pierwszego słoika kombuchy do pełnoprawnej manufaktury — oto nasza droga.",
  "location_title": "Gdzie Nas Znajdziesz?",
  "location_description": "Działamy z małej miejscowości na Mazurach, gdzie czyste powietrze i piękna natura inspirują nas każdego dnia. Nasze produkty wysyłamy do całej Polski — świeże i starannie zapakowane.",
  "location_cta": "Skontaktuj się z Nami",
  "gallery_title": "Nasza Codzienność",
  "gallery_subtitle": "Zajrzyj za kulisy naszej pracy"
}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET content = site_content.content || '{"gallery_title": "Nasza Codzienność", "gallery_subtitle": "Zajrzyj za kulisy naszej pracy"}'::jsonb;