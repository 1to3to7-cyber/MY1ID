"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useState } from "react";

export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? error.message : "Authentication failed",
        };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return { supabase, signIn, signOut, loading };
}
