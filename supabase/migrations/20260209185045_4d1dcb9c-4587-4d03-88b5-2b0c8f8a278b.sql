-- Prevent any updates to order items (immutable after creation)
CREATE POLICY "Prevent order item updates"
ON public.order_items
FOR UPDATE
USING (false);

-- Prevent any deletions of order items
CREATE POLICY "Prevent order item deletions"
ON public.order_items
FOR DELETE
USING (false);