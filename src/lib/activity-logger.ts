import { createClient } from "@/lib/supabase/client";

export async function logActivity(
  action: string,
  entityType: string,
  entityId?: string,
  details?: string
) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("activity_logs").insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
    if (error) console.error("Activity log error:", error.message);
  } catch {
    // Silent fail - logging is non-critical
  }
}
