"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart3,
  File,
  FolderOpen,
  Globe,
  Mail,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalVisitors: number;
  totalProjects: number;
  totalFiles: number;
  totalMessages: number;
  unreadMessages: number;
  recentVisitors: { id: string; country?: string; page_visited: string; created_at: string }[];
  recentMessages: { id: string; name: string; subject: string; is_read: boolean; created_at: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [visitors, projects, files, messages] = await Promise.all([
        supabase.from("visitors").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("files").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
      ]);

      const { data: recentVisitors } = await supabase
        .from("visitors")
        .select("id, country, page_visited, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: recentMessages } = await supabase
        .from("messages")
        .select("id, name, subject, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const { count: unread } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      setStats({
        totalVisitors: visitors.count || 0,
        totalProjects: projects.count || 0,
        totalFiles: files.count || 0,
        totalMessages: messages.count || 0,
        unreadMessages: unread || 0,
        recentVisitors: recentVisitors || [],
        recentMessages: recentMessages || [],
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Visitors",
      value: stats?.totalVisitors || 0,
      icon: Globe,
      color: "text-rwanda-green",
      bg: "bg-rwanda-green/20",
    },
    {
      label: "Projects",
      value: stats?.totalProjects || 0,
      icon: FolderOpen,
      color: "text-rwanda-blue",
      bg: "bg-rwanda-blue/20",
    },
    {
      label: "Files",
      value: stats?.totalFiles || 0,
      icon: File,
      color: "text-rwanda-yellow",
      bg: "bg-rwanda-yellow/20",
    },
    {
      label: "Messages",
      value: stats?.totalMessages || 0,
      icon: Mail,
      color: "text-rwanda-green",
      bg: "bg-rwanda-green/20",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-white mb-1">
          Welcome back
        </h1>
        <p className="text-dark-400 text-sm">
          Here&apos;s an overview of your platform.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-rwanda-blue/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <TrendingUp className="h-4 w-4 text-dark-500" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-dark-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Recent Messages
                {stats && stats.unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {stats.unreadMessages} unread
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentMessages.length === 0 ? (
                <p className="text-dark-400 text-sm text-center py-8">No messages yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats?.recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-glass"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {msg.subject}
                        </p>
                        <p className="text-xs text-dark-400">{msg.name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!msg.is_read && (
                          <div className="h-2 w-2 rounded-full bg-rwanda-blue" />
                        )}
                        <span className="text-xs text-dark-500">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Recent Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentVisitors.length === 0 ? (
                <p className="text-dark-400 text-sm text-center py-8">No visitors yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats?.recentVisitors.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-glass"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-dark-400" />
                        <div>
                          <p className="text-sm text-white">{v.country || "Unknown"}</p>
                          <p className="text-xs text-dark-400">{v.page_visited}</p>
                        </div>
                      </div>
                      <span className="text-xs text-dark-500">
                        {formatDate(v.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
