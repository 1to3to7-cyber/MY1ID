"use client";

import { FLAG_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RwandaLoaderProps {
  loading: boolean;
  message?: string;
  variant?: "imigongo" | "agaseke" | "flag" | "kinyarwanda";
  fullScreen?: boolean;
  minDuration?: number;
}

const RW_WORDS = ["Tegereza...", "Mbere...", "Gukora...", "Byose birashoboka"];

/* ─── Variant 1: Imigongo ─────────────────────────────────── */
function ImigongoSpinner() {
  return (
    <div className="relative h-20 w-20">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.div
          key={angle}
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: `${angle}deg` }}
          animate={{ rotate: [angle, angle + 360] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <motion.div
            className="h-3 w-3 rounded-sm"
            style={{
              backgroundColor: [FLAG_COLORS.green, FLAG_COLORS.yellow, FLAG_COLORS.blue][i % 3],
              opacity: 0.6,
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.12 }}
          />
        </motion.div>
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        <div
          className="h-10 w-10 rounded-md border-2"
          style={{
            borderColor: `${FLAG_COLORS.blue}40`,
            background: `linear-gradient(135deg, ${FLAG_COLORS.green}15, ${FLAG_COLORS.yellow}15, ${FLAG_COLORS.blue}15)`,
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Variant 2: Agaseke (basket weaving) ─────────────────── */
function AgasekeSpinner() {
  const segments = 12;
  return (
    <div className="relative h-24 w-24">
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / segments) * 360;
        const isWeft = i % 2 === 0;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ rotate: `${angle}deg` }}
            animate={{ rotate: [angle, angle + 5, angle] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.08, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                width: isWeft ? 2 : 3,
                height: isWeft ? 36 : 28,
                background: isWeft
                  ? `linear-gradient(to top, ${FLAG_COLORS.green}, ${FLAG_COLORS.yellow})`
                  : `linear-gradient(to top, ${FLAG_COLORS.blue}, ${FLAG_COLORS.green})`,
                opacity: 0.7,
                transformOrigin: "bottom center",
              }}
              animate={{ scaleY: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.1 }}
            />
          </motion.div>
        );
      })}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="h-6 w-6 rounded-full border-2 border-rwanda-blue/30 bg-rwanda-green/10" />
      </motion.div>
    </div>
  );
}

/* ─── Variant 3: Flag particles ───────────────────────────── */
function FlagParticleSpinner() {
  const particles = 24;
  return (
    <div className="relative h-24 w-24">
      {Array.from({ length: particles }).map((_, i) => {
        const angle = (i / particles) * 360;
        const radius = 36 + Math.sin(i * 1.5) * 8;
        const colors = [FLAG_COLORS.green, FLAG_COLORS.yellow, FLAG_COLORS.blue];
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              x: [0, Math.cos(i) * 6, 0],
              y: [0, Math.sin(i) * 6, 0],
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: i * 0.06,
              ease: "easeInOut",
            }}
          >
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colors[i % 3] }}
            />
          </motion.div>
        );
      })}
      {/* Rwanda map outline hint */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="h-16 w-16 opacity-20">
          <path
            d="M50 10 C55 10 65 15 70 25 C75 35 78 45 75 55 C72 65 65 78 55 85 C45 92 35 90 28 82 C20 74 18 62 20 50 C22 38 28 25 35 18 C40 13 45 10 50 10Z"
            fill="none"
            stroke={FLAG_COLORS.blue}
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </div>
  );
}

/* ─── Variant 4: Kinyarwanda text ─────────────────────────── */
function KinyarwandaTextLoader({ message }: { message?: string }) {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setWordIdx((p) => (p + 1) % RW_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [message]);

  const displayText = message || RW_WORDS[wordIdx];

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="relative h-14 w-14"
      >
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-rwanda-blue/40" />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${FLAG_COLORS.green}, ${FLAG_COLORS.yellow}, ${FLAG_COLORS.blue}, ${FLAG_COLORS.green})`,
            opacity: 0.3,
          }}
        />
        <motion.div
          className="absolute inset-4 rounded-full bg-rwanda-green/20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={displayText}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-sm font-display font-medium tracking-wide"
          style={{ color: FLAG_COLORS.yellow }}
        >
          {displayText}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Loader ──────────────────────────────────────────── */
function LoaderContent({ variant, message }: { variant: string; message?: string }) {
  switch (variant) {
    case "imigongo":
      return (
        <div className="flex flex-col items-center gap-4">
          <ImigongoSpinner />
          <p className="text-xs text-dark-400 font-medium tracking-widest uppercase">Imigongo</p>
        </div>
      );
    case "agaseke":
      return (
        <div className="flex flex-col items-center gap-4">
          <AgasekeSpinner />
          <p className="text-xs text-dark-400 font-medium tracking-widest uppercase">Agaseke</p>
        </div>
      );
    case "flag":
      return (
        <div className="flex flex-col items-center gap-4">
          <FlagParticleSpinner />
          <p className="text-xs text-dark-400 font-medium tracking-widest uppercase">Rwanda</p>
        </div>
      );
    case "kinyarwanda":
    default:
      return <KinyarwandaTextLoader message={message} />;
  }
}

export function RwandaLoader({
  loading,
  message,
  variant = "kinyarwanda",
  fullScreen = false,
  minDuration = 300,
}: RwandaLoaderProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (loading) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), minDuration);
      return () => clearTimeout(timer);
    }
  }, [loading, minDuration]);

  if (!show) return null;

  const loader = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center justify-center z-50",
        fullScreen
          ? "fixed inset-0 bg-dark-950/80 backdrop-blur-md"
          : "absolute inset-0 bg-dark-900/70 backdrop-blur-sm rounded-xl"
      )}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl p-10",
          fullScreen
            ? "border border-glass-border bg-dark-900/90 backdrop-blur-xl shadow-2xl"
            : ""
        )}
      >
        <LoaderContent variant={variant} message={message} />
      </motion.div>
    </motion.div>
  );

  if (fullScreen) return <AnimatePresence>{loader}</AnimatePresence>;

  return (
    <div className="relative">
      <AnimatePresence>{loader}</AnimatePresence>
    </div>
  );
}

/* ─── Hook for easy use ───────────────────────────────────── */
export function useRwandaLoader(initial = false) {
  const [loading, setLoading] = useState(initial);

  const withLoader = async <T,>(fn: () => Promise<T>, minMs = 400): Promise<T> => {
    setLoading(true);
    const start = Date.now();
    try {
      return await fn();
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minMs - elapsed);
      await new Promise((r) => setTimeout(r, remaining));
      setLoading(false);
    }
  };

  return { loading, setLoading, withLoader };
}
