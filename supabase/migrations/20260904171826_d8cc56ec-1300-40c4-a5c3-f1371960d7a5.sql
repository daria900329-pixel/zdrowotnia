CREATE TYPE public.manual_order_status AS ENUM ('new', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled');
CREATE TYPE public.fulfillment_method AS ENUM ('pickup', 'delivery');

CREATE TABLE public.manual_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  fulfillment public.fulfillment_method NOT NULL DEFAULT 'pickup',
  delivery_address text,
  due_date date NOT NULL,
  status public.manual_order_status NOT NULL DEFAULT 'new',
  is_paid boolean NOT NULL DEFAULT false,
  note text,
  total_amount numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_orders TO authenticated;
GRANT ALL ON public.manual_orders TO service_role;
ALTER TABLE public.manual_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage manual orders" ON public.manual_orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.manual_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.manual_orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  variant_name text,
  unit_price numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_order_items TO authenticated;
GRANT ALL ON public.manual_order_items TO service_role;
ALTER TABLE public.manual_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage manual order items" ON public.manual_order_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX manual_orders_due_date_idx ON public.manual_orders (due_date);
CREATE INDEX manual_order_items_order_id_idx ON public.manual_order_items (order_id);

CREATE TRIGGER update_manual_orders_updated_at BEFORE UPDATE ON public.manual_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();