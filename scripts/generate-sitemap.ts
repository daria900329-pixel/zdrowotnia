// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://zdrowotnia.lovable.app";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/o-nas", changefreq: "monthly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
];

async function dynamicEntries(): Promise<SitemapEntry[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("sitemap: backend env vars missing — writing static routes only");
    return [];
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const entries: SitemapEntry[] = [];

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("is_active", true);
  for (const p of products ?? []) {
    entries.push({ path: `/product/${p.id}`, changefreq: "weekly", priority: "0.9" });
  }

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  for (const post of posts ?? []) {
    entries.push({ path: `/blog/${post.slug}`, changefreq: "monthly", priority: "0.7" });
  }

  return entries;
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const entries = [...staticEntries, ...(await dynamicEntries())];
writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
