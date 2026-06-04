"use client";

import { RwandaLoader, useRwandaLoader } from "@/components/ui/rwanda-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { founderProfileSchema } from "@/lib/validations";
import { motion } from "framer-motion";
import { Shield, User, Save, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { loading, withLoader } = useRwandaLoader();
  const [editing, setEditing] = useState(false);
  interface FormState {
    name: string; role: string; location: string; email: string; phone: string;
    bio: string; education: string; school: string; skills: string; goals: string;
    languages: string; tagline: string;
    hero_stat_1_label: string; hero_stat_1_value: string;
    hero_stat_2_label: string; hero_stat_2_value: string;
    hero_stat_3_label: string; hero_stat_3_value: string;
  }
  const [form, setForm] = useState<FormState>({
    name: String(SITE_CONFIG.founder.name),
    role: String(SITE_CONFIG.founder.role),
    location: String(SITE_CONFIG.founder.location),
    email: String(SITE_CONFIG.founder.email),
    phone: String(SITE_CONFIG.founder.phone || ""),
    bio: String(SITE_CONFIG.founder.bio || ""),
    education: String(SITE_CONFIG.founder.education),
    school: String(SITE_CONFIG.founder.school),
    skills: SITE_CONFIG.founder.skills.join(", "),
    goals: SITE_CONFIG.founder.goals.join(", "),
    languages: SITE_CONFIG.founder.languages.join(", "),
    tagline: String(SITE_CONFIG.tagline),
    hero_stat_1_label: String(SITE_CONFIG.founder.hero_stat_1_label || "Years Experience"),
    hero_stat_1_value: String(SITE_CONFIG.founder.hero_stat_1_value || "5+"),
    hero_stat_2_label: String(SITE_CONFIG.founder.hero_stat_2_label || "Projects Completed"),
    hero_stat_2_value: String(SITE_CONFIG.founder.hero_stat_2_value || "20+"),
    hero_stat_3_label: String(SITE_CONFIG.founder.hero_stat_3_label || "Technologies"),
    hero_stat_3_value: String(SITE_CONFIG.founder.hero_stat_3_value || "15+"),
  });

  const handleSave = async () => {
    const parsed = founderProfileSchema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please fix the form errors");
      return;
    }

    await withLoader(async () => {
      try {
        const supabase = createClient();
        const raw = parsed.data;
        const data = {
          ...raw,
          skills: (raw.skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
          goals: (raw.goals || "").split(",").map((s: string) => s.trim()).filter(Boolean),
          languages: (raw.languages || "").split(",").map((s: string) => s.trim()).filter(Boolean),
        };

        const { error } = await supabase
          .from("founder_profile")
          .upsert({ id: "default", ...data, updated_at: new Date().toISOString() });

        if (error) throw error;
        toast.success("Profile updated! Changes will reflect across the site.");
        setEditing(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  const handleReset = () => {
    setForm({
      name: String(SITE_CONFIG.founder.name),
      role: String(SITE_CONFIG.founder.role),
      location: String(SITE_CONFIG.founder.location),
      email: String(SITE_CONFIG.founder.email),
      phone: String(SITE_CONFIG.founder.phone || ""),
      bio: String(SITE_CONFIG.founder.bio || ""),
      education: String(SITE_CONFIG.founder.education),
      school: String(SITE_CONFIG.founder.school),
      skills: SITE_CONFIG.founder.skills.join(", "),
      goals: SITE_CONFIG.founder.goals.join(", "),
      languages: SITE_CONFIG.founder.languages.join(", "),
      tagline: String(SITE_CONFIG.tagline),
      hero_stat_1_label: String(SITE_CONFIG.founder.hero_stat_1_label || "Years Experience"),
      hero_stat_1_value: String(SITE_CONFIG.founder.hero_stat_1_value || "5+"),
      hero_stat_2_label: String(SITE_CONFIG.founder.hero_stat_2_label || "Projects Completed"),
      hero_stat_2_value: String(SITE_CONFIG.founder.hero_stat_2_value || "20+"),
      hero_stat_3_label: String(SITE_CONFIG.founder.hero_stat_3_label || "Technologies"),
      hero_stat_3_value: String(SITE_CONFIG.founder.hero_stat_3_value || "15+"),
    });
    setEditing(false);
    toast.success("Reset to defaults");
  };

  return (
    <div className="relative max-w-3xl space-y-6">
      <RwandaLoader loading={loading} variant="kinyarwanda" message="Saving profile..." />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
          <p className="text-dark-400 text-sm">Manage your profile and platform settings</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <Button variant="gradient" onClick={() => setEditing(true)} className="gap-2">
              <Save className="h-4 w-4" /> Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Reset
              </Button>
              <Button variant="gradient" onClick={handleSave} className="gap-2" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!editing} />
            </div>
            <div className="space-y-2">
              <Label>Role / Title</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} disabled={!editing} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!editing} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!editing} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} disabled={!editing} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} disabled={!editing} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} disabled={!editing} className="min-h-[120px]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Education</Label>
              <Input value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} disabled={!editing} />
            </div>
            <div className="space-y-2">
              <Label>School</Label>
              <Input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} disabled={!editing} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Skills (comma separated)</Label>
            <Textarea value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} disabled={!editing} className="min-h-[80px]" />
          </div>
          <div className="space-y-2">
            <Label>Goals (comma separated)</Label>
            <Textarea value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} disabled={!editing} className="min-h-[80px]" />
          </div>
          <div className="space-y-2">
            <Label>Languages (comma separated)</Label>
            <Input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} disabled={!editing} />
          </div>
        </CardContent>
      </Card>

      {/* Hero Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hero Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Stat 1 Label</Label>
              <Input value={form.hero_stat_1_label} onChange={(e) => setForm({ ...form, hero_stat_1_label: e.target.value })} disabled={!editing} />
              <Input value={form.hero_stat_1_value} onChange={(e) => setForm({ ...form, hero_stat_1_value: e.target.value })} disabled={!editing} placeholder="Value" />
            </div>
            <div className="space-y-2">
              <Label>Stat 2 Label</Label>
              <Input value={form.hero_stat_2_label} onChange={(e) => setForm({ ...form, hero_stat_2_label: e.target.value })} disabled={!editing} />
              <Input value={form.hero_stat_2_value} onChange={(e) => setForm({ ...form, hero_stat_2_value: e.target.value })} disabled={!editing} placeholder="Value" />
            </div>
            <div className="space-y-2">
              <Label>Stat 3 Label</Label>
              <Input value={form.hero_stat_3_label} onChange={(e) => setForm({ ...form, hero_stat_3_label: e.target.value })} disabled={!editing} />
              <Input value={form.hero_stat_3_value} onChange={(e) => setForm({ ...form, hero_stat_3_value: e.target.value })} disabled={!editing} placeholder="Value" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-rwanda-green/10 border border-rwanda-green/20">
            <p className="text-sm text-rwanda-green font-medium">Authentication Active</p>
            <p className="text-xs text-dark-400 mt-1">
              Admin access is secured with Supabase Auth. All admin actions are logged.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Admin Email</Label>
            <div className="flex items-center gap-2">
              <Input value={SITE_CONFIG.founder.email} disabled />
              <Badge variant="success" className="shrink-0">Verified</Badge>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-dark-800/50 border border-glass-border">
            <p className="text-sm text-dark-300 font-medium">Activity Logging</p>
            <p className="text-xs text-dark-400 mt-1">
              All admin actions (create, update, delete) are logged to the activity_logs table.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-glass">
              <p className="text-xs text-dark-400">Version</p>
              <p className="text-sm text-white font-medium">2.0.0</p>
            </div>
            <div className="p-3 rounded-lg bg-glass">
              <p className="text-xs text-dark-400">Framework</p>
              <p className="text-sm text-white font-medium">Next.js 16</p>
            </div>
            <div className="p-3 rounded-lg bg-glass">
              <p className="text-xs text-dark-400">Database</p>
              <p className="text-sm text-white font-medium">Supabase</p>
            </div>
            <div className="p-3 rounded-lg bg-glass">
              <p className="text-xs text-dark-400">Auth</p>
              <p className="text-sm text-white font-medium">Supabase Auth</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
