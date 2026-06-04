"use client";

import { RwandaLoader, useRwandaLoader } from "@/components/ui/rwanda-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";
import { motion } from "framer-motion";
import { Edit, ExternalLink, ImageIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleteLoading(id);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const getCategoryLabel = (val: string) =>
    PROJECT_CATEGORIES.find((c) => c.value === val)?.label || val;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
          <p className="text-dark-400 text-sm">{projects.length} projects</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <ImageIcon className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No projects yet.</p>
          <Link href="/dashboard/projects/new">
            <Button variant="gradient" className="mt-4 gap-2"><Plus className="h-4 w-4" /> Create First Project</Button>
          </Link>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="hover:border-rwanda-blue/30 transition-all duration-300 relative">
                {deleteLoading === project.id && (
                  <div className="absolute inset-0 bg-dark-900/70 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-rwanda-green border-t-transparent animate-spin" />
                      <p className="text-xs text-dark-400">Deleting...</p>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{project.title}</CardTitle>
                      <p className="text-xs text-dark-400 mt-1">{formatDate(project.created_at)}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                      {getCategoryLabel(project.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-dark-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="gap-1.5 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                    {project.project_url && (
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                        className="ml-auto text-dark-400 hover:text-rwanda-blue transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
