"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/types";
import { motion } from "framer-motion";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getSupabase = () => createClient();

  const fetchMessages = async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: string) => {
    const supabase = getSupabase();
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setActionLoading(id);
    try {
      const supabase = getSupabase();
      await supabase.from("messages").delete().eq("id", id);
      toast.success("Message deleted");
      if (selected?.id === id) setSelected(null);
      fetchMessages();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setActionLoading(null);
    }
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
        <h1 className="font-display text-2xl font-bold text-white">Messages</h1>
        <p className="text-dark-400 text-sm">
          {messages.filter((m) => !m.is_read).length} unread · {messages.length} total
        </p>
      </div>

      {messages.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Mail className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No messages yet.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card
                className={`cursor-pointer transition-all duration-200 hover:border-rwanda-blue/30 relative ${
                  !msg.is_read ? "border-rwanda-blue/40" : ""
                } ${actionLoading === msg.id ? "opacity-50" : ""}`}
                onClick={() => { setSelected(msg); if (!msg.is_read) markAsRead(msg.id); }}
              >
                {actionLoading === msg.id && (
                  <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-rwanda-green border-t-transparent animate-spin" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      !msg.is_read ? "bg-rwanda-blue/20" : "bg-glass"
                    }`}>
                      {!msg.is_read ? (
                        <Mail className="h-4 w-4 text-rwanda-blue" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-dark-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{msg.name}</span>
                        {!msg.is_read && <div className="h-2 w-2 rounded-full bg-rwanda-blue shrink-0" />}
                        <span className="text-xs text-dark-500 ml-auto shrink-0">{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="text-sm text-dark-300 font-medium mb-1">{msg.subject}</p>
                      <p className="text-xs text-dark-400 line-clamp-2">{msg.message}</p>
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
          <DialogHeader><DialogTitle>{selected?.subject}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div><p className="text-dark-400 text-xs">From</p><p className="text-white font-medium">{selected.name}</p></div>
                <div><p className="text-dark-400 text-xs">Email</p><p className="text-rwanda-blue">{selected.email}</p></div>
                <div className="ml-auto"><p className="text-dark-400 text-xs">Date</p><p className="text-dark-300">{formatDate(selected.created_at)}</p></div>
              </div>
              <div className="p-4 rounded-lg bg-glass">
                <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rwanda-blue text-white text-sm font-medium hover:bg-rwanda-blue/90 transition-colors">
                  <Mail className="h-4 w-4" /> Reply
                </a>
                <Button variant="ghost" onClick={() => { handleDelete(selected.id); setSelected(null); }}
                  className="gap-2 text-red-400"><Trash2 className="h-4 w-4" /> Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
