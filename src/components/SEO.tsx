import { Helmet } from "react-helmet-async";

const BASE_URL = "https://zdrowotnia.lovable.app";
const DEFAULT_OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/STZ57ehiccMf1X8Ml9n3vEoubDt1/social-images/social-1769279652377-Główne logo.png";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | Zdrowotnia`
    : "Zdrowotnia — Prawdziwe jedzenie z prostych powodów";
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(jsonLd) ? jsonLd : jsonLd
          )}
        </script>
      )}
    </Helmet>
  );
}

// Reusable JSON-LD schemas
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Zdrowotnia",
  description: "Rodzinna manufaktura naturalnego jedzenia — kombucha, ocet owocowy, chleb na zakwasie, mięso z własnej hodowli.",
  url: "https://zdrowotnia.lovable.app",
  image: DEFAULT_OG_IMAGE,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Warmińsko-Mazurskie",
    addressCountry: "PL",
  },
};

export function productJsonLd(product: {
  name: string;
  description?: string | null;
  image?: string | null;
  id: string;
  price?: number | null;
  currency?: string;
}) {
  const result: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} — naturalny produkt od Zdrowotni`,
    image: product.image || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/product/${product.id}`,
    brand: {
      "@type": "Brand",
      name: "Zdrowotnia",
    },
  };

  if (product.price != null) {
    result.offers = {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: product.currency || "PLN",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Zdrowotnia",
      },
    };
  }

  return result;
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
