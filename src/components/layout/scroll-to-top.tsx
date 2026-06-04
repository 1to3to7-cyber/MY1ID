"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5 }}
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 p-3 rounded-2xl shadow-2xl cursor-pointer",
        "bg-gradient-to-br from-rwanda-blue/80 to-rwanda-green/80",
        "border border-white/20 backdrop-blur-xl",
        "hover:from-rwanda-blue hover:to-rwanda-green",
        "transition-all duration-300 hover:scale-110"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5 text-white" />
    </motion.button>
  );
}
