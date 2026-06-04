"use client";

import { RwandaLoader, useRwandaLoader } from "@/components/ui/rwanda-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_IMAGES, projectSchema } from "@/lib/validations";
import type { Project } from "@/types";
import { motion } from "framer-motion";
import { ChevronLeft, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { loading, withLoader } = useRwandaLoader();
  const [pageLoading, setPageLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", project_url: "",
    category: "web", hidden_password: "", status: "public" as "public" | "draft",
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("projects").select("*").eq("id", id).single();
      if (data) {
        setProject(data);
        setForm({
          title: data.title,
          description: data.description,
          project_url: data.project_url || "",
          category: data.category,
          hidden_password: data.hidden_password || "",
          status: (data as any).status || "public",
        });
        setExistingImages(data.cover_images || []);
      }
      setPageLoading(false);
    };
    fetchProject();
  }, [id]);

  const addImages = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(
      (f) => ALLOWED_IMAGE_TYPES.includes(f.type) && f.size <= MAX_IMAGE_SIZE
    );
    if (newImages.length + arr.length > MAX_IMAGES - existingImages.length) {
      toast.error(`Maximum ${MAX_IMAGES} images total`);
      return;
    }
    setNewImages((p) => [...p, ...arr]);
    setNewPreviews((p) => [...p, ...arr.map((f) => URL.createObjectURL(f))]);
  }, [newImages.length, existingImages.length]);

  const removeNewImage = (idx: number) => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewImages((p) => p.filter((_, i) => i !== idx));
    setNewPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const removeExisting = (url: string) => {
    setExistingImages((p) => p.filter((u) => u !== url));
  };

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
        const coverImages = [...existingImages];

        for (const file of newImages) {
          const ext = file.name.split(".").pop();
          const path = `projects/covers/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadErr } = await supabase.storage.from("files").upload(path, file);
          if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);
          const { data: { publicUrl } } = supabase.storage.from("files").getPublicUrl(path);
          coverImages.push(publicUrl);
        }

        const { error: dbErr } = await supabase
          .from("projects")
          .update({ ...parsed.data, cover_images: coverImages })
          .eq("id", id);

        if (dbErr) throw new Error(dbErr.message);
        toast.success("Project updated!");
        router.push("/dashboard/projects");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Update failed");
      }
    });
  };

  if (pageLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto space-y-6">
      <RwandaLoader loading={loading} variant="agaseke" message="Updating project..." />

      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Edit Project</h1>
          <p className="text-dark-400 text-sm">{form.title || "Untitled"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Title <span className="text-red-400">*</span></Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-red-400">*</span></Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[160px]" />
              {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project URL</Label>
                <Input value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Select value={form.status}                 onValueChange={(v) => setForm({ ...form, status: v as "public" | "draft" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hidden Password</Label>
                <Input type="password" value={form.hidden_password} onChange={(e) => setForm({ ...form, hidden_password: e.target.value })} placeholder="Optional" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cover Images</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addImages(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
                dragOver ? "border-rwanda-blue bg-rwanda-blue/5" : "border-glass-border hover:border-rwanda-blue/50"
              }`}
            >
              <Upload className="h-6 w-6 text-dark-400 mb-2" />
              <p className="text-sm text-dark-300">Add more images</p>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && addImages(e.target.files)} />
            </div>

            {(existingImages.length > 0 || newPreviews.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map((url) => (
                  <div key={url} className="relative group aspect-video rounded-lg overflow-hidden border border-glass-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeExisting(url)} className="p-2 rounded-full bg-red-500/80"><Trash2 className="h-4 w-4 text-white" /></button>
                    </div>
                  </div>
                ))}
                {newPreviews.map((src, i) => (
                  <div key={src} className="relative group aspect-video rounded-lg overflow-hidden border border-glass-border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeNewImage(i)} className="p-2 rounded-full bg-red-500/80"><Trash2 className="h-4 w-4 text-white" /></button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rwanda-green/80 text-[10px] text-white">New</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="gradient" size="lg" disabled={loading}>
            {loading ? "Updating..." : "Update Project"}
          </Button>
          <Link href="/dashboard/projects"><Button type="button" variant="ghost" size="lg">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
