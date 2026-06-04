import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileIcon(type: string): string {
  if (type.includes("pdf")) return "file-text";
  if (type.includes("word") || type.includes("doc")) return "file-text";
  if (type.includes("excel") || type.includes("sheet") || type.includes("xls"))
    return "file-spreadsheet";
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return "archive";
  if (type.includes("image")) return "image";
  if (type.includes("video")) return "video";
  return "file";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateId(): string {
  return crypto.randomUUID();
}
