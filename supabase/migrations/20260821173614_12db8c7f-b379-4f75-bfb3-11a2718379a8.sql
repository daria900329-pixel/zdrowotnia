ALTER POLICY "Admins can update site content" ON public.site_content TO authenticated;
ALTER POLICY "Admins can insert site content" ON public.site_content TO authenticated;
ALTER POLICY "Admins can manage variants" ON public.product_variants TO authenticated;
ALTER POLICY "Admins can view all orders" ON public.orders TO authenticated;
ALTER POLICY "Admins can update orders" ON public.orders TO authenticated;
ALTER POLICY "Admins can view all order items" ON public.order_items TO authenticated;
ALTER POLICY "Admins can insert product images" ON public.product_images TO authenticated;
ALTER POLICY "Admins can update product images" ON public.product_images TO authenticated;
ALTER POLICY "Admins can delete product images" ON public.product_images TO authenticated;
ALTER POLICY "Admins can manage gallery images" ON public.about_gallery TO authenticated;
ALTER POLICY "Admins can manage product sections" ON public.product_description_sections TO authenticated;
ALTER POLICY "Admins can manage blog posts" ON public.blog_posts TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;