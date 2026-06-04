"use client";

import { RwandaLoader, useRwandaLoader } from "@/components/ui/rwanda-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FILE_CATEGORIES, FILE_VISIBILITY } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, fileSchema } from "@/lib/validations";
import { formatFileSize } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Archive,
  ChevronLeft,
  FileIcon,
  FileText,
  FileVideo,
  Image,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

function FileTypeIcon({ type, className = "h-8 w-8" }: { type: string; className?: string }) {
  if (type.includes("pdf") || type.includes("doc") || type.includes("word"))
    return <FileText className={`${className} text-rwanda-blue`} />;
  if (type.includes("image"))
    return <Image className={`${className} text-rwanda-green`} />;
  if (type.includes("video"))
    return <FileVideo className={`${className} text-rwanda-yellow`} />;
  if (type.includes("zip") || type.includes("rar"))
    return <Archive className={`${className} text-dark-400`} />;
  return <FileIcon className={`${className} text-dark-400`} />;
}

export default function UploadFilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("document");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(f.type)) {
      toast.error(`"${f.name}" — This file type is not supported`);
      return false;
    }
    if (f.size > MAX_FILE_SIZE) {
      toast.error(`"${f.name}" exceeds 50MB limit`);
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) {
      setFile(f);
      setName(f.name);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && validateFile(f)) {
      setFile(f);
      setName(f.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const parsed = fileSchema.safeParse({ name, description, category, visibility });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `files/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      setProgress(30);
      const { error: uploadErr } = await supabase.storage
        .from("files")
        .upload(path, file);

      if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);
      setProgress(70);

      const { data: { publicUrl } } = supabase.storage
        .from("files")
        .getPublicUrl(path);

      setProgress(85);
      const { error: dbErr } = await supabase.from("files").insert({
        name: path,
        original_name: file.name,
        type: file.type,
        size: file.size,
        url: publicUrl,
        description: parsed.data.description || null,
        category: parsed.data.category || null,
        visibility: parsed.data.visibility,
      });

      if (dbErr) throw new Error(dbErr.message);
      setProgress(100);

      toast.success("File uploaded successfully!");
      setTimeout(() => router.push("/dashboard/files"), 400);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setProgress(0);
      setLoading(false);
    } finally {
      if (progress >= 100) setLoading(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto space-y-6">
      <RwandaLoader loading={loading} variant="imigongo" message="Uploading file..." />

      <div className="flex items-center gap-4">
        <Link href="/dashboard/files">
          <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Upload File</h1>
          <p className="text-dark-400 text-sm">Share documents, reports, and resources</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>File Selection</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div
              ref={dropRef}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-rwanda-blue bg-rwanda-blue/5"
                  : "border-glass-border hover:border-rwanda-blue/50 hover:bg-glass"
              }`}
            >
              {file ? (
                <div className="flex items-center gap-4">
                  <FileTypeIcon type={file.type} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-dark-400">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setName(""); }}
                    className="p-1.5 rounded-full hover:bg-glass-hover text-dark-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-dark-400 mb-3" />
                  <p className="text-sm text-dark-300 font-medium">
                    Drag & drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-dark-500 mt-1">
                    PDF, DOCX, XLSX, ZIP, Images, Video — max 50MB
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleSelect}
              />
            </div>

            {file && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="flex items-center gap-3 p-3 rounded-lg bg-glass"
              >
                <FileTypeIcon type={file.type} className="h-6 w-6" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">{file.name}</p>
                  <p className="text-xs text-dark-400">{formatFileSize(file.size)}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                </Badge>
              </motion.div>
            )}

            {progress > 0 && progress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-dark-400">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-dark-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-rwanda-green via-rwanda-yellow to-rwanda-blue"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>File Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Title <span className="text-red-400">*</span></Label>
              <motion.div whileFocus={{ scale: 1.01 }}>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Display name for this file"
                  className={errors.name ? "border-red-400" : ""}
                />
              </motion.div>
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this file..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILE_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v as "public" | "private")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILE_VISIBILITY.map((v) => (
                      <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="gradient" size="lg" disabled={loading || !file} className="gap-2">
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {loading ? "Uploading..." : "Upload File"}
          </Button>
          <Link href="/dashboard/files">
            <Button type="button" variant="ghost" size="lg">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
