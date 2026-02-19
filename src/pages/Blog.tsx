import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Loader2, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
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

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, category, created_at")
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Blog i Przepisy"
        description="Przepisy, porady i artykuły o fermentacji, zdrowym odżywianiu i naturalnym gotowaniu od Zdrowotni."
        canonical="/blog"
      />
      <Header />

      <main className="pt-28 sm:pt-36 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 text-primary font-semibold mb-3 bg-primary/15 px-3 py-1.5 rounded-full text-sm">
              <BookOpen className="w-4 h-4" /> Nasza wiedza
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Blog i Przepisy</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Przepisy, porady o fermentacji i wszystko, co warto wiedzieć o naturalnym jedzeniu.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Wkrótce pojawią się tu artykuły i przepisy!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 100}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group bg-card border border-border/30 rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    {post.cover_image_url ? (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[post.category] ?? post.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
