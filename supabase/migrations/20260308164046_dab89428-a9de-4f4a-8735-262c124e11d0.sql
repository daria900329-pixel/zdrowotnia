
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL DEFAULT '',
  html_content TEXT NOT NULL DEFAULT '',
  description TEXT,
  available_variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates"
  ON public.email_templates
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can read email templates"
  ON public.email_templates
  FOR SELECT
  TO service_role
  USING (true);

-- Seed default template
INSERT INTO public.email_templates (template_key, subject, description, available_variables, html_content)
VALUES (
  'order_confirmation',
  'Potwierdzenie zamówienia #{{order_id_short}}',
  'Wysyłany automatycznie po opłaceniu zamówienia przez Stripe',
  ARRAY['{{customer_email}}', '{{order_id}}', '{{order_id_short}}', '{{order_total}}', '{{order_items}}', '{{order_date}}'],
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; background: #ffffff; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #faf8f5; border-radius: 12px; padding: 40px;">
    <h1 style="color: #5c4a3a; font-size: 24px; margin-bottom: 8px;">Dziękujemy za zamówienie! 🌿</h1>
    <p style="color: #7a6b5d; font-size: 14px;">Zamówienie <strong>#{{order_id_short}}</strong> z dnia {{order_date}}</p>
    <hr style="border: none; border-top: 1px solid #e8e0d8; margin: 24px 0;">
    {{order_items}}
    <hr style="border: none; border-top: 1px solid #e8e0d8; margin: 24px 0;">
    <p style="color: #5c4a3a; font-size: 18px; font-weight: bold; text-align: right;">Razem: {{order_total}}</p>
    <p style="color: #7a6b5d; font-size: 13px; margin-top: 32px; text-align: center;">Zdrowotnia – naturalne produkty z pasją 🍯</p>
  </div>
</body>
</html>'
);
