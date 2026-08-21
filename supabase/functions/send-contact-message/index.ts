import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || name.length > 120 || !emailValid || email.length > 200 || !message || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Invalid form data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Recipient: contact e-mail from the CMS, with env fallback.
    let recipient = Deno.env.get("CONTACT_EMAIL") ?? "";
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "contact")
        .maybeSingle();
      const cmsEmail = (data?.content as Record<string, string> | null)?.email;
      if (cmsEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cmsEmail)) recipient = cmsEmail;
    } catch (e) {
      console.error("Could not read contact e-mail from CMS:", e);
    }

    if (!recipient) {
      console.error("No contact recipient configured");
      return new Response(
        JSON.stringify({ error: "Contact recipient not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const html = `
      <h2>Nowa wiadomość ze strony Zdrowotnia</h2>
      <p><strong>Imię i nazwisko:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Wiadomość:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: Deno.env.get("EMAIL_FROM") || "Zdrowotnia <zamowienia@zdrowotnia.pl>",
        to: [recipient],
        reply_to: email,
        subject: `Wiadomość ze strony — ${name}`,
        html,
      }),
    });

    const resendData = await resendResponse.json();
    if (!resendResponse.ok) {
      console.error(`Resend error [${resendResponse.status}]:`, resendData);
      return new Response(
        JSON.stringify({ error: "Failed to send message", details: resendData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const messageText = error instanceof Error ? error.message : "Unknown error";
    console.error("send-contact-message error:", error);
    return new Response(
      JSON.stringify({ error: messageText }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
