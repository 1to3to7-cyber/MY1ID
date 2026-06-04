-- ============================================================
-- BIZIMANA FILS WEB PRO - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_url TEXT,
  cover_images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'web',
  hidden_password TEXT,
  status TEXT NOT NULL DEFAULT 'public' CHECK (status IN ('public', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  description TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT,
  country TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  page_visited TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Bizimana Fils',
  category TEXT DEFAULT 'inspiration',
  background_url TEXT,
  likes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Founder profile table (editable settings)
CREATE TABLE IF NOT EXISTS founder_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Bizimana Fils',
  role TEXT NOT NULL DEFAULT 'Electrical Vehicle Technician & Innovation Technologist',
  location TEXT NOT NULL DEFAULT 'Kigali, Rwanda',
  email TEXT NOT NULL DEFAULT 'bizimanaideaagency@gmail.com',
  phone TEXT DEFAULT '0783444370 / 0795914094',
  bio TEXT,
  education TEXT DEFAULT 'A2 Certificate in Automobile Technology',
  school TEXT DEFAULT 'Ecole Technique de Kabgayi',
  skills TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{"Kinyarwanda", "English"}',
  image TEXT DEFAULT '/images/founder.jpg',
  tagline TEXT DEFAULT 'Innovating at the Intersection of Technology & African Ingenuity',
  hero_stat_1_label TEXT DEFAULT 'Years Experience',
  hero_stat_1_value TEXT DEFAULT '5+',
  hero_stat_2_label TEXT DEFAULT 'Projects Completed',
  hero_stat_2_value TEXT DEFAULT '20+',
  hero_stat_3_label TEXT DEFAULT 'Technologies',
  hero_stat_3_value TEXT DEFAULT '15+',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_file_id ON comments(file_id);
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_page_visited ON visitors(page_visited);
CREATE INDEX IF NOT EXISTS idx_quotes_is_active ON quotes(is_active);
CREATE INDEX IF NOT EXISTS idx_quotes_category ON quotes(category);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Public can read projects
CREATE POLICY "Public read projects"
  ON projects FOR SELECT
  USING (true);

-- Only authenticated admin can insert/update/delete projects
CREATE POLICY "Admin insert projects"
  ON projects FOR INSERT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Public can read files
CREATE POLICY "Public read files"
  ON files FOR SELECT
  USING (true);

-- Only authenticated admin can manage files
CREATE POLICY "Admin insert files"
  ON files FOR INSERT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update files"
  ON files FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete files"
  ON files FOR DELETE
  USING (auth.role() = 'authenticated');

-- Public can insert messages
CREATE POLICY "Public insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can read/update/delete messages
CREATE POLICY "Admin read messages"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update messages"
  ON messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete messages"
  ON messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- Public can insert comments
CREATE POLICY "Public insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Public can read approved comments
CREATE POLICY "Public read approved comments"
  ON comments FOR SELECT
  USING (is_approved = true OR auth.role() = 'authenticated');

-- Admin can manage comments
CREATE POLICY "Admin update comments"
  ON comments FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete comments"
  ON comments FOR DELETE
  USING (auth.role() = 'authenticated');

-- Only authenticated admin can read visitors
CREATE POLICY "Admin read visitors"
  ON visitors FOR SELECT
  USING (auth.role() = 'authenticated');

-- Public can insert visitors (for tracking)
CREATE POLICY "Public insert visitors"
  ON visitors FOR INSERT
  WITH CHECK (true);

-- Public can read active quotes
CREATE POLICY "Public read active quotes"
  ON quotes FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Only authenticated admin can manage quotes
CREATE POLICY "Admin insert quotes"
  ON quotes FOR INSERT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update quotes"
  ON quotes FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete quotes"
  ON quotes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Public can read founder_profile
CREATE POLICY "Public read founder_profile"
  ON founder_profile FOR SELECT
  USING (true);

-- Only authenticated admin can update founder_profile
CREATE POLICY "Admin update founder_profile"
  ON founder_profile FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only authenticated admin can read activity logs
CREATE POLICY "Admin read activity_logs"
  ON activity_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can insert activity logs
CREATE POLICY "Admin insert activity_logs"
  ON activity_logs FOR INSERT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Create storage bucket for files
-- Run this in Supabase Storage:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true);

-- Storage policy: Public read
-- CREATE POLICY "Public read files storage"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'files');

-- Storage policy: Admin write
-- CREATE POLICY "Admin write files storage"
--   ON storage.objects FOR INSERT
--   USING (bucket_id = 'files' AND auth.role() = 'authenticated');

-- ============================================================
-- MIGRATIONS FOR EXISTING TABLES
-- Run these if tables already exist without the new columns
-- ============================================================

-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'public' CHECK (status IN ('public', 'draft'));
-- ALTER TABLE files ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private'));

-- ============================================================
-- AUTO UPDATE TIMESTAMP FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
