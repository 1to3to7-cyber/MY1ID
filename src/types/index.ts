export type ProjectCategory = "ai" | "ev" | "web" | "automobile" | "research" | "other";

export interface Project {
  id: string;
  title: string;
  description: string;
  project_url?: string;
  cover_images: string[];
  category: ProjectCategory;
  hidden_password?: string;
  status: "public" | "draft";
  created_at: string;
  updated_at: string;
}

export interface FileItem {
  id: string;
  name: string;
  original_name: string;
  type: string;
  size: number;
  url: string;
  category?: string;
  description?: string;
  visibility: "public" | "private";
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  content: string;
  project_id?: string;
  file_id?: string;
  is_approved: boolean;
  created_at: string;
}

export interface Visitor {
  id: string;
  ip_address?: string;
  country?: string;
  device?: string;
  browser?: string;
  os?: string;
  page_visited: string;
  referrer?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  background_url?: string;
  likes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  education: string;
  school: string;
  skills: string[];
  goals: string[];
  languages: string[];
  image: string;
  tagline: string;
  hero_stat_1_label: string;
  hero_stat_1_value: string;
  hero_stat_2_label: string;
  hero_stat_2_value: string;
  hero_stat_3_label: string;
  hero_stat_3_value: string;
}

export interface DashboardStats {
  totalVisitors: number;
  totalProjects: number;
  totalFiles: number;
  totalMessages: number;
  unreadMessages: number;
  recentVisitors: Visitor[];
  recentMessages: Message[];
}
