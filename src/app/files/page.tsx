"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatFileSize } from "@/lib/utils";
import type { FileItem } from "@/types";
import { motion } from "framer-motion";
import {
  Archive,
  Download,
  FileIcon,
  FileText,
  FileVideo,
  Image,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

function getFileIcon(type: string) {
  if (type.includes("pdf") || type.includes("doc") || type.includes("word"))
    return <FileText className="h-8 w-8 text-rwanda-blue" />;
  if (type.includes("image"))
    return <Image className="h-8 w-8 text-rwanda-green" />;
  if (type.includes("video"))
    return <FileVideo className="h-8 w-8 text-rwanda-yellow" />;
  if (type.includes("zip") || type.includes("rar"))
    return <Archive className="h-8 w-8 text-dark-400" />;
  return <FileIcon className="h-8 w-8 text-dark-400" />;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setFiles(data);
      setLoading(false);
    };
    fetchFiles();
  }, []);

  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.original_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
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
          <Badge variant="outline" className="mb-4">Resources</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Downloadable <span className="gradient-text">Files</span>
          </h1>
          <p className="text-dark-400 max-w-2xl">
            Browse and download documents, reports, presentations, and more.
          </p>
        </motion.div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="h-16 w-16 rounded-2xl bg-glass border border-glass-border flex items-center justify-center mx-auto mb-4">
              <FileIcon className="h-8 w-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No files found</h3>
            <p className="text-dark-400 text-sm">
              {search ? "Try a different search term." : "No files have been uploaded yet."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
              >
                <Card className="group hover:border-rwanda-blue/30 transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">{getFileIcon(file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm truncate">
                          {file.original_name || file.name}
                        </h3>
                        {file.description && (
                          <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                            {file.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-dark-500">
                            {formatFileSize(file.size)}
                          </span>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-rwanda-blue hover:text-rwanda-blue/80 transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
