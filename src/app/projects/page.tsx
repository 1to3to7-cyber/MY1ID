"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/types";
import { motion } from "framer-motion";
import {
  ExternalLink,
  FolderOpen,
  ImageIcon,
  Search,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI Innovation" },
  { value: "ev", label: "EV Technology" },
  { value: "web", label: "Web Development" },
  { value: "automobile", label: "Automobile" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <FolderOpen className="h-3 w-3 mr-1.5" />
            Portfolio
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-dark-400 max-w-2xl">
            A showcase of my work in automotive technology, web development, AI, and research.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="h-10 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-xs whitespace-nowrap">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="h-16 w-16 rounded-2xl bg-glass border border-glass-border flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
            <p className="text-dark-400 text-sm">
              {search
                ? "Try adjusting your search or filter criteria."
                : "Projects will appear here once added."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card className="group h-full overflow-hidden hover:border-rwanda-blue/30 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden bg-dark-800">
                    {project.cover_images?.[0] ? (
                      <img
                        src={project.cover_images[0]}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-dark-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-dark-400 text-sm line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-rwanda-blue hover:text-rwanda-blue/80 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Project
                        </a>
                      )}
                      {project.hidden_password && (
                        <span className="flex items-center gap-1 text-xs text-dark-500">
                          <Shield className="h-3 w-3" />
                          Protected
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Project preview"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
