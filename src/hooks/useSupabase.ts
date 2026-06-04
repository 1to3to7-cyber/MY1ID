"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    try {
      setSupabase(createClient());
    } catch {
      setSupabase(null);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const client = createClient();
        const { data, error } = await client.auth.signInWithPassword({
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
    []
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const client = createClient();
      const { error } = await client.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { supabase, signIn, signOut, loading };
}