"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { quoteSchema } from "@/lib/validations";
import type { Quote } from "@/types";
import { motion } from "framer-motion";
import { Heart, Plus, Bookmark, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [form, setForm] = useState({ text: "", author: "Bizimana Fils", category: "inspiration", background_url: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const fetchQuotes = async () => {
    const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (data) setQuotes(data);
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsed = quoteSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("quotes").insert({
        text: parsed.data.text,
        author: parsed.data.author,
        category: parsed.data.category || null,
        background_url: parsed.data.background_url || null,
      });
      if (error) throw error;
      toast.success("Quote added!");
      setShowNew(false);
      setForm({ text: "", author: "Bizimana Fils", category: "inspiration", background_url: "" });
      fetchQuotes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add quote");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    setDeleteLoading(id);
    try {
      const { error } = await supabase.from("quotes").delete().eq("id", id);
      if (error) throw error;
      toast.success("Quote deleted");
      fetchQuotes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleActive = async (quote: Quote) => {
    const { error } = await supabase.from("quotes").update({ is_active: !quote.is_active }).eq("id", quote.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(quote.is_active ? "Quote hidden" : "Quote published");
    fetchQuotes();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Quotes</h1>
          <p className="text-dark-400 text-sm">{quotes.length} quotes</p>
        </div>
        <Button variant="gradient" onClick={() => setShowNew(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Quote
        </Button>
      </div>

      {quotes.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Bookmark className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No quotes yet.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <motion.div key={quote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`relative transition-all duration-200 ${deleteLoading === quote.id ? "opacity-50" : ""} ${!quote.is_active ? "border-dark-700" : "hover:border-rwanda-blue/30"}`}>
                {deleteLoading === quote.id && (
                  <div className="absolute inset-0 bg-dark-900/70 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-rwanda-green border-t-transparent animate-spin" />
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Bookmark className="h-6 w-6 text-rwanda-blue/30 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium leading-relaxed">
                        &ldquo;{quote.text}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-xs text-rwanda-yellow font-medium">— {quote.author}</p>
                        {quote.category && (
                          <Badge variant="secondary" className="text-[10px]">{quote.category}</Badge>
                        )}
                        <span className="text-xs text-dark-500">{formatDate(quote.created_at)}</span>
                      </div>
                      {quote.likes > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span className="text-xs text-dark-400">{quote.likes}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleActive(quote)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          quote.is_active
                            ? "bg-rwanda-green/20 text-rwanda-green"
                            : "bg-dark-800 text-dark-400"
                        }`}
                      >
                        {quote.is_active ? "Active" : "Hidden"}
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add New Quote</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Quote Text <span className="text-red-400">*</span></Label>
              <Textarea
                id="text"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Enter the quote..."
                className={`min-h-[100px] ${formErrors.text ? "border-red-400" : ""}`}
              />
              {formErrors.text && <p className="text-xs text-red-400">{formErrors.text}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspiration">Inspiration</SelectItem>
                    <SelectItem value="wisdom">Wisdom</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="innovation">Innovation</SelectItem>
                    <SelectItem value="motivation">Motivation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background_url">Background Image URL (optional)</Label>
              <Input
                id="background_url"
                value={form.background_url}
                onChange={(e) => setForm({ ...form, background_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? "Adding..." : "Add Quote"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
