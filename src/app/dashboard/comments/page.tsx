"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types";
import { motion } from "framer-motion";
import { CheckCircle, MessageSquare, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Comment | null>(null);
  const supabase = createClient();

  const fetchComments = async () => {
    const { data } = await supabase.from("comments").select("*").order("created_at", { ascending: false });
    if (data) setComments(data);
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const toggleApproval = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("comments").update({ is_approved: approved }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(approved ? "Comment approved" : "Comment rejected");
    fetchComments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Comment deleted");
    if (selected?.id === id) setSelected(null);
    fetchComments();
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
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Comments</h1>
        <p className="text-dark-400 text-sm">{comments.length} total · {comments.filter((c) => !c.is_approved).length} pending</p>
      </div>

      {comments.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <MessageSquare className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No comments yet.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card
                className={`cursor-pointer transition-all hover:border-rwanda-blue/30 ${!c.is_approved ? "border-rwanda-yellow/30" : ""}`}
                onClick={() => setSelected(c)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${c.is_approved ? "bg-rwanda-green/20" : "bg-rwanda-yellow/20"}`}>
                      <MessageSquare className={`h-4 w-4 ${c.is_approved ? "text-rwanda-green" : "text-rwanda-yellow"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{c.author_name}</span>
                        {!c.is_approved && <Badge variant="warning" className="text-[10px]">Pending</Badge>}
                        <span className="text-xs text-dark-500 ml-auto">{formatDate(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-dark-300 line-clamp-2">{c.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Comment by {selected?.author_name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div><p className="text-dark-400 text-xs">From</p><p className="text-white font-medium">{selected.author_name}</p></div>
                <div><p className="text-dark-400 text-xs">Email</p><p className="text-rwanda-blue">{selected.author_email}</p></div>
                <div className="ml-auto"><p className="text-dark-400 text-xs">Date</p><p className="text-dark-300">{formatDate(selected.created_at)}</p></div>
              </div>
              <div className="p-4 rounded-lg bg-glass">
                <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{selected.content}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {!selected.is_approved ? (
                    <Button variant="gradient" size="sm" onClick={() => toggleApproval(selected.id, true)} className="gap-1.5">
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => toggleApproval(selected.id, false)} className="gap-1.5">
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => { handleDelete(selected.id); setSelected(null); }} className="gap-1.5 text-red-400">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
