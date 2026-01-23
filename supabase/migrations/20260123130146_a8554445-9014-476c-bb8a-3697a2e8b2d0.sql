-- CMS: Tabela na edytowalne treści strony
CREATE TABLE public.site_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key text NOT NULL UNIQUE,
    content jsonb NOT NULL DEFAULT '{}',
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Warianty produktów (pojemności, wagi, ceny)
CREATE TABLE public.product_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name text NOT NULL,
    unit text NOT NULL DEFAULT 'ml',
    value numeric NOT NULL,
    price numeric(10,2) NOT NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Koszyk zakupowy (powiązany z kontem)
CREATE TABLE public.cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id uuid NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, variant_id)
);

-- Zamówienia
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    status text NOT NULL DEFAULT 'pending',
    total_amount numeric(10,2) NOT NULL,
    stripe_session_id text,
    stripe_payment_intent_id text,
    shipping_address jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Pozycje zamówienia
CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id),
    variant_id uuid NOT NULL REFERENCES public.product_variants(id),
    product_name text NOT NULL,
    variant_name text NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS dla site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
ON public.site_content FOR SELECT
USING (true);

CREATE POLICY "Admins can update site content"
ON public.site_content FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert site content"
ON public.site_content FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS dla product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active variants"
ON public.product_variants FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage variants"
ON public.product_variants FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS dla cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
ON public.cart_items FOR ALL
USING (auth.uid() = user_id);

-- RLS dla orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS dla order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
));

CREATE POLICY "Users can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can view all order items"
ON public.order_items FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger dla updated_at
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Domyślne treści CMS
INSERT INTO public.site_content (section_key, content) VALUES
('hero', '{"title": "Witaj w naszym domu! 🏡", "subtitle": "Rodzinne produkty tworzone z miłością — kombucha, ocet, chleb na zakwasie i mięso z własnej hodowli.", "badge": "Domowe, naturalne, z sercem"}'),
('about', '{"title": "Witaj w naszym domu! 🏡", "badge": "Nasza Historia", "paragraph1": "Jesteśmy zwykłą rodziną, która odkryła magię domowego jedzenia. To, co zaczęło się jako pasja — fermentacja pierwszej kombuchy w kuchni — dziś stało się sposobem życia, którym chcemy się dzielić.", "paragraph2": "Nasze produkty powstają dokładnie tak, jak robiły to nasze babcie — bez pośpiechu, z sercem i z najlepszych składników. Króliki hodujemy sami, chleb pieczymy na zakwasie, który ma już ponad 3 lata!", "highlight": "✨ Wierzymy, że dobre jedzenie łączy ludzi. Zapraszamy Cię do naszego stołu!"}'),
('contact', '{"title": "Porozmawiajmy! 💬", "subtitle": "Masz pytania? Chcesz złożyć zamówienie? Napisz lub zadzwoń — odpowiadamy szybko i z uśmiechem!", "phone": "+48 123 456 789", "email": "kontakt@rodzinnesmaki.pl", "address": "ul. Słoneczna 15, 00-001 Warszawa"}'),
('footer', '{"tagline": "Tworzymy z miłością, pakujemy z uśmiechem, dostarczamy z sercem. Dziękujemy, że jesteś częścią naszej rodziny! 💕"}'),
('products', '{"title": "Co dziś dla Ciebie przygotowaliśmy? 🥰", "subtitle": "Każdy produkt robimy ręcznie, w małych partiach. Dokładnie tak, jak byśmy przygotowywali je dla własnej rodziny — bo tak właśnie jest!", "badge": "Prosto z Naszej Kuchni", "coming_soon": "Pasztet z królika • Kurczaki z wolnego wybiegu • Jajka od szczęśliwych kurek • Oliwa z Włoch"}')