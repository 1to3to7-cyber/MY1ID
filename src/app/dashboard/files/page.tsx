"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { FILE_CATEGORIES } from "@/lib/constants";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/validations";
import type { FileItem } from "@/types";
import { formatDate, formatFileSize } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Archive,
  Download,
  FileIcon,
  FileText,
  FileVideo,
  Image,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getFileIcon(type: string) {
  if (type.includes("pdf") || type.includes("doc") || type.includes("word"))
    return <FileText className="h-5 w-5 text-rwanda-blue" />;
  if (type.includes("image")) return <Image className="h-5 w-5 text-rwanda-green" />;
  if (type.includes("video")) return <FileVideo className="h-5 w-5 text-rwanda-yellow" />;
  if (type.includes("zip") || type.includes("rar")) return <Archive className="h-5 w-5 text-dark-400" />;
  return <FileIcon className="h-5 w-5 text-dark-400" />;
}

export default function DashboardFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const supabase = createClient();

  const fetchFiles = async () => {
    const { data } = await supabase.from("files").select("*").order("created_at", { ascending: false });
    if (data) setFiles(data);
    setLoading(false);
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    setDeleteLoading(id);
    try {
      const { error } = await supabase.from("files").delete().eq("id", id);
      if (error) throw error;
      toast.success("File deleted");
      fetchFiles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Files</h1>
          <p className="text-dark-400 text-sm">{files.length} files</p>
        </div>
        <Link href="/dashboard/files/upload">
          <Button variant="gradient" className="gap-2"><Plus className="h-4 w-4" /> Upload File</Button>
        </Link>
      </div>

      {files.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <FileIcon className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No files uploaded yet.</p>
          <Link href="/dashboard/files/upload">
            <Button variant="gradient" className="mt-4 gap-2"><Upload className="h-4 w-4" /> Upload First File</Button>
          </Link>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`hover:border-rwanda-blue/30 transition-all duration-300 relative ${deleteLoading === file.id ? "opacity-50" : ""}`}>
                {deleteLoading === file.id && (
                  <div className="absolute inset-0 bg-dark-900/70 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border-2 border-rwanda-green border-t-transparent animate-spin" />
                      <p className="text-xs text-dark-400">Deleting...</p>
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.original_name || file.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-dark-500">{formatFileSize(file.size)}</span>
                        <span className="text-xs text-dark-500">{formatDate(file.created_at)}</span>
                        {file.category && <Badge variant="secondary" className="text-xs">{file.category}</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a href={file.url} target="_blank" rel="noopener noreferrer"
                        className="p-2 text-dark-400 hover:text-rwanda-blue transition-colors"><Download className="h-4 w-4" /></a>
                      <button onClick={() => handleDelete(file.id)}
                        className="p-2 text-dark-400 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
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
