import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteContentData {
  [key: string]: string | undefined;
}

interface UseSiteContentReturn {
  content: SiteContentData;
  loading: boolean;
  error: Error | null;
  updateContent: (sectionKey: string, newContent: SiteContentData) => Promise<boolean>;
}

export function useSiteContent(sectionKey: string): UseSiteContentReturn {
  const [content, setContent] = useState<SiteContentData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", sectionKey)
        .maybeSingle();

      if (error) {
        setError(error);
      } else if (data?.content) {
        setContent(data.content as SiteContentData);
      }
      setLoading(false);
    }

    fetchContent();
  }, [sectionKey]);

  const updateContent = useCallback(async (key: string, newContent: SiteContentData): Promise<boolean> => {
    const { error } = await supabase
      .from("site_content")
      .update({ content: newContent })
      .eq("section_key", key);

    if (error) {
      console.error("Failed to update content:", error);
      return false;
    }
    setContent(newContent);
    return true;
  }, []);

  return { content, loading, error, updateContent };
}
