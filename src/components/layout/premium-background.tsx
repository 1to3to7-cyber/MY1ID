"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const RWANDA_IMAGES = [
  {
    src: "/images/rwanda-kigali.jpg",
    alt: "Kigali Cityscape",
    credit: "Visit Rwanda",
  },
  {
    src: "/images/rwanda-volcanoes.jpg",
    alt: "Volcanoes National Park",
    credit: "Visit Rwanda",
  },
  {
    src: "/images/rwanda-lake-kivu.jpg",
    alt: "Lake Kivu",
    credit: "Visit Rwanda",
  },
  {
    src: "/images/rwanda-nyungwe.jpg",
    alt: "Nyungwe Forest",
    credit: "Visit Rwanda",
  },
  {
    src: "/images/rwanda-hills.jpg",
    alt: "Rwandan Hills",
    credit: "Visit Rwanda",
  },
];

export function PremiumBackground() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % RWANDA_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/60 to-dark-950/90 z-10" />
          <Image
            src={RWANDA_IMAGES[current].src}
            alt={RWANDA_IMAGES[current].alt}
            fill
            className="object-cover"
            priority
            onLoad={() => setLoaded(true)}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0"
      )}>
        {RWANDA_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex items-center justify-center p-2 -m-2 group"
            aria-label={`Slide ${i + 1}`}
          >
            <span className={cn(
              "block rounded-full transition-all duration-500",
              i === current
                ? "w-8 sm:w-6 h-1.5 bg-white/80"
                : "w-1.5 h-1.5 bg-white/30 group-hover:bg-white/50"
            )} />
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <span className="text-[10px] sm:text-xs text-white/20 font-light tracking-widest uppercase">
          ✦ Visit Rwanda
        </span>
      </div>
    </div>
  );
}
