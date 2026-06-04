"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const supabase = createClient();
        const page = window.location.pathname;

        const ipResponse = await fetch("https://ipapi.co/json/").catch(() => null);
        if (!ipResponse) return;
        const ipData = await ipResponse.json();

        await supabase.from("visitors").insert({
          ip_address: ipData.ip,
          country: ipData.country_name,
          device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
          browser: navigator.userAgent.includes("Chrome") ? "Chrome"
            : navigator.userAgent.includes("Firefox") ? "Firefox"
            : navigator.userAgent.includes("Safari") ? "Safari"
            : "Other",
          os: navigator.userAgent.includes("Windows") ? "Windows"
            : navigator.userAgent.includes("Mac") ? "macOS"
            : navigator.userAgent.includes("Linux") ? "Linux"
            : "Other",
          page_visited: page,
          referrer: document.referrer || null,
        });
      } catch {
        // Silent fail - tracking is not critical
      }
    };

    trackVisit();
  }, []);

  return null;
}
