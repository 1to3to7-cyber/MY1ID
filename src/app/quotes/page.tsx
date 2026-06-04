"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Quote } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Bookmark,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const categoryGradients: Record<string, string> = {
  inspiration: "from-rwanda-blue/20 to-rwanda-green/20",
  wisdom: "from-rwanda-yellow/20 to-rwanda-green/20",
  technology: "from-rwanda-green/20 to-rwanda-blue/20",
  innovation: "from-rwanda-blue/20 to-rwanda-yellow/20",
  motivation: "from-rwanda-green/20 to-rwanda-yellow/20",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchQuotes = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("quotes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setQuotes(data);
      setLoading(false);
    };
    fetchQuotes();
  }, []);

  const handleLike = async (quote: Quote) => {
    if (liked.has(quote.id)) {
      toast.error("You already liked this quote");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("quotes")
      .update({ likes: (quote.likes || 0) + 1 })
      .eq("id", quote.id);
    if (error) return;
    setLiked((prev) => new Set(prev).add(quote.id));
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quote.id ? { ...q, likes: (q.likes || 0) + 1 } : q
      )
    );
  };

  const handleShare = async (quote: Quote) => {
    const text = `"${quote.text}" — ${quote.author}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Quote copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mb-8 mx-auto" />
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1.5" />
            Wisdom
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Inspirational <span className="gradient-text">Quotes</span>
          </h1>
          <p className="text-dark-400 max-w-xl mx-auto">
            Words of wisdom and inspiration from Bizimana Fils and great minds
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {quotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="h-16 w-16 rounded-2xl bg-glass border border-glass-border flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-8 w-8 text-dark-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No quotes yet</h3>
              <p className="text-dark-400 text-sm">Inspirational quotes will appear here.</p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {quotes.map((quote, i) => (
                <motion.div
                  key={quote.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Card className="premium-card group overflow-hidden hover:border-rwanda-blue/30 transition-all duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[quote.category || "inspiration"] || "from-glass to-glass"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardContent className="relative p-8">
                      <Bookmark className="h-8 w-8 text-rwanda-blue/20 mb-4" />
                      <blockquote className="text-xl sm:text-2xl font-display text-white font-medium leading-relaxed mb-6 text-balance">
                        &ldquo;{quote.text}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-rwanda-yellow">
                            — {quote.author}
                          </p>
                          {quote.category && (
                            <Badge variant="outline" className="mt-2 text-[10px]">
                              {quote.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLike(quote)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                              liked.has(quote.id)
                                ? "bg-red-500/20 text-red-400"
                                : "bg-glass text-dark-400 hover:text-white hover:bg-glass-hover"
                            }`}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                liked.has(quote.id) ? "fill-red-400" : ""
                              }`}
                            />
                            {quote.likes || 0}
                          </button>
                          <button
                            onClick={() => handleShare(quote)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-glass text-dark-400 hover:text-white hover:bg-glass-hover text-xs transition-all duration-200"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            Share
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
