import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO, breadcrumbJsonLd, articleJsonLd } from "@/components/SEO";
import { Loader2, ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  przepis: "Przepis",
  porada: "Porada",
  fermentacja: "Fermentacja",
  zdrowie: "Zdrowie",
};

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateStr));

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-36 pb-20 container mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-4">Artykuł nie został znaleziony.</p>
          <Button asChild variant="outline">
            <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Wróć do bloga</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const crumbs = breadcrumbJsonLd([
    { name: "Strona główna", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen">
      <SEO
        title={post.title}
        description={post.excerpt ?? undefined}
        canonical={`/blog/${post.slug}`}
        ogImage={post.cover_image_url ?? undefined}
        ogType="article"
        jsonLd={[
          articleJsonLd({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            image: post.cover_image_url,
            datePublished: post.created_at,
          }),
          crumbs,
        ]}
      />
      <Header />

      <main className="pt-36 pb-20">
        <article className="container mx-auto px-6 max-w-3xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Blog i Przepisy
          </Link>

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">
              {categoryLabels[post.category] ?? post.category}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(post.created_at)}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary/40 pl-4 italic">
              {post.excerpt}
            </p>
          )}

          {post.content && (
            <div
              className="prose prose-stone max-w-none text-foreground leading-relaxed"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {post.content}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
