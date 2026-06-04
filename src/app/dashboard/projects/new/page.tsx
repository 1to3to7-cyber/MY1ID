"use client";

import { RwandaLoader, useRwandaLoader } from "@/components/ui/rwanda-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_IMAGES, projectSchema } from "@/lib/validations";
import { motion } from "framer-motion";
import { ChevronLeft, ImageIcon, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export default function NewProjectPage() {
  const router = useRouter();
  const { loading, withLoader } = useRwandaLoader();
  const [form, setForm] = useState({
    title: "",
    description: "",
    project_url: "",
    category: "web",
    hidden_password: "",
    status: "public" as "public" | "draft",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addImages = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const valid: File[] = [];

    for (const f of arr) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
        toast.error(`"${f.name}" is not a supported image type`);
        continue;
      }
      if (f.size > MAX_IMAGE_SIZE) {
        toast.error(`"${f.name}" exceeds 10MB limit`);
        continue;
      }
      valid.push(f);
    }

    const total = images.length + valid.length;
    if (total > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    setImages((prev) => [...prev, ...valid]);
    setPreviews((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
  }, [images.length]);

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addImages(e.dataTransfer.files);
    },
    [addImages]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    await withLoader(async () => {
      try {
        const supabase = createClient();
        const coverImages: string[] = [];

        for (let i = 0; i < images.length; i++) {
          const ext = images[i].name.split(".").pop();
          const path = `projects/covers/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

          setUploadProgress(Math.round(((i + 1) / images.length) * 80));

          const { error: uploadErr } = await supabase.storage
            .from("files")
            .upload(path, images[i]);

          if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);

          const { data: { publicUrl } } = supabase.storage
            .from("files")
            .getPublicUrl(path);

          coverImages.push(publicUrl);
          setUploadProgress(80 + Math.round(((i + 1) / images.length) * 15));
        }

        setUploadProgress(95);
        const { error: dbErr } = await supabase.from("projects").insert({
          title: parsed.data.title,
          description: parsed.data.description,
          project_url: parsed.data.project_url || null,
          category: parsed.data.category,
          hidden_password: parsed.data.hidden_password || null,
          status: parsed.data.status,
          cover_images: coverImages,
        });

        if (dbErr) throw new Error(dbErr.message);

        setUploadProgress(100);
        toast.success("Project created successfully!");
        router.push("/dashboard/projects");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create project");
        setUploadProgress(0);
      }
    });
  };

  return (
    <div className="relative max-w-3xl mx-auto space-y-6">
      <RwandaLoader loading={loading} variant="agaseke" message="Creating project..." />

      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">New Project</h1>
          <p className="text-dark-400 text-sm">Showcase your work to the world</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-400">*</span></Label>
              <motion.div whileFocus={{ scale: 1.01 }}>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter project title"
                  className={errors.title ? "border-red-400" : ""}
                />
              </motion.div>
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-400">*</span></Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your project in detail..."
                className={`min-h-[160px] ${errors.description ? "border-red-400" : ""}`}
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_url">Project URL / Live Link</Label>
                <Input
                  id="project_url"
                  value={form.project_url}
                  onChange={(e) => setForm({ ...form, project_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Category <span className="text-red-400">*</span></Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as "public" | "draft" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hidden_password">Hidden Password (optional)</Label>
                <Input
                  id="hidden_password"
                  type="password"
                  value={form.hidden_password}
                  onChange={(e) => setForm({ ...form, hidden_password: e.target.value })}
                  placeholder="Leave empty for public"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cover Images</CardTitle></CardHeader>
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
              <Upload className="h-8 w-8 text-dark-400 mb-3" />
              <p className="text-sm text-dark-300 font-medium">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-xs text-dark-500 mt-1">
                PNG, JPG, WebP up to 10MB each (max {MAX_IMAGES} images)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && addImages(e.target.files)}
              />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previews.map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group aspect-video rounded-lg overflow-hidden border border-glass-border bg-dark-800"
                  >
                    <img
                      src={src}
                      alt={`Cover ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-dark-950/70 text-xs text-white">
                      {i + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-dark-400">
                  <span>Uploading images...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-dark-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-rwanda-green via-rwanda-yellow to-rwanda-blue"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="gradient" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
          <Link href="/dashboard/projects">
            <Button type="button" variant="ghost" size="lg">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
