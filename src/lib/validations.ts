import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().min(2, "Izina rigomba kuba byibuze inyuguti 2").max(100),
  email: z.string().email("Email itariyo"),
  subject: z.string().min(5, "Ikiganiro kigomba kuba byibuze inyuguti 5").max(200),
  message: z.string().min(10, "Ubutumwa bugomba kuba byibuze inyuguti 10").max(5000),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  project_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  category: z.enum(["ai", "ev", "web", "automobile", "research", "other"]),
  hidden_password: z.string().max(200).optional().or(z.literal("")),
  status: z.enum(["public", "draft"]).default("public"),
});

export const fileSchema = z.object({
  name: z.string().min(1, "File name is required").max(255),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().max(100).optional().or(z.literal("")),
  visibility: z.enum(["public", "private"]).default("public"),
});

export const commentSchema = z.object({
  author_name: z.string().min(2, "Izina rigomba kuba byibuze inyuguti 2").max(100),
  author_email: z.string().email("Email itariyo"),
  content: z.string().min(1, "Icyo uvuga ntigishobora kuba ubusa").max(2000),
});

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-rar-compressed",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "text/plain",
  "text/csv",
];

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_IMAGES = 6;

export const quoteSchema = z.object({
  text: z.string().min(5, "Quote must be at least 5 characters").max(500),
  author: z.string().min(1, "Author is required").max(100),
  category: z.string().max(100).optional().or(z.literal("")),
  background_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const founderProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().min(1, "Role is required").max(200),
  location: z.string().min(1, "Location is required").max(200),
  email: z.string().email("Invalid email"),
  phone: z.string().max(100).optional().or(z.literal("")),
  bio: z.string().max(5000).optional().or(z.literal("")),
  education: z.string().max(300).optional().or(z.literal("")),
  school: z.string().max(300).optional().or(z.literal("")),
  skills: z.string().optional(),  // comma separated
  goals: z.string().optional(),   // comma separated
  languages: z.string().optional(), // comma separated
  tagline: z.string().max(300).optional().or(z.literal("")),
  hero_stat_1_label: z.string().max(100).optional().or(z.literal("")),
  hero_stat_1_value: z.string().max(100).optional().or(z.literal("")),
  hero_stat_2_label: z.string().max(100).optional().or(z.literal("")),
  hero_stat_2_value: z.string().max(100).optional().or(z.literal("")),
  hero_stat_3_label: z.string().max(100).optional().or(z.literal("")),
  hero_stat_3_value: z.string().max(100).optional().or(z.literal("")),
});

export const RATE_LIMIT_WINDOW = 60 * 1000;
export const RATE_LIMIT_MAX = 5;
export const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000;
export const LOGIN_RATE_LIMIT_MAX = 5;
