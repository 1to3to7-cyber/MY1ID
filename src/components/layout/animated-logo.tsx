"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FULL_NAME = "Bizimana Fils";
const letters = FULL_NAME.split("");

const FLAG_COLORS = ["#00A651", "#FEDD00", "#003F87"];

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, []);
  return { ref, pos };
}

export function AnimatedLogo() {
  const [hovered, setHovered] = useState(false);
  const { ref, pos } = useMousePosition();

  return (
    <Link
      href="/"
      className="flex items-center gap-3 group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated BF icon */}
      <motion.div
        ref={ref}
        className="relative h-10 w-10 shrink-0"
        animate={hovered ? { rotate: [0, -5, 5, -5, 0] } : { rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Rotating gradient border */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `conic-gradient(from ${hovered ? 0 : 0}deg, ${FLAG_COLORS[0]}, ${FLAG_COLORS[1]}, ${FLAG_COLORS[2]}, ${FLAG_COLORS[0]})`,
            padding: 2,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={
            hovered
              ? { rotate: 360 }
              : { rotate: 0 }
          }
          transition={
            hovered
              ? { duration: 2, repeat: Infinity, ease: "linear" }
              : { duration: 0.5 }
          }
        />
        {/* Inner background */}
        <div className="absolute inset-[2px] rounded-[10px] bg-dark-950 flex items-center justify-center overflow-hidden">
          {/* Pulse glow */}
          <motion.div
            className="absolute inset-0 rounded-[10px]"
            animate={{
              boxShadow: hovered
                ? [
                    "inset 0 0 6px rgba(0,166,81,0.3)",
                    "inset 0 0 12px rgba(254,221,0,0.2)",
                    "inset 0 0 6px rgba(0,63,135,0.3)",
                    "inset 0 0 6px rgba(0,166,81,0.3)",
                  ]
                : "inset 0 0 4px rgba(0,166,81,0.15)",
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* BF letters */}
          <motion.span
            className="text-sm font-black relative z-10"
            animate={
              hovered
                ? {
                    color: ["#00A651", "#FEDD00", "#003F87", "#00A651"],
                    scale: [1, 1.1, 1],
                  }
                : { color: "#ffffff", scale: 1 }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            BF
          </motion.span>
        </div>
        {/* Mouse-follow glow */}
        <motion.div
          className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none blur-2xl"
          animate={
            hovered
              ? {
                  background: `radial-gradient(120px circle at ${pos.x}px ${pos.y}px, rgba(0,166,81,0.15), transparent)`,
                }
              : {}
          }
        />
      </motion.div>

      {/* Animated Name */}
      <div className="hidden sm:flex items-center">
        {letters.map((letter, i) => {
          const isSpace = letter === " ";
          return (
            <motion.span
              key={`${letter}-${i}`}
              className={cn(
                "inline-block font-display text-lg font-bold",
                isSpace ? "w-[0.4em]" : "",
                hovered ? "cursor-default" : ""
              )}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{
                opacity: 1,
                y: hovered ? [0, -2, 0, 2, 0] : 0,
                filter: "blur(0px)",
                color: hovered
                  ? [
                      FLAG_COLORS[i % 3],
                      FLAG_COLORS[(i + 1) % 3],
                      FLAG_COLORS[(i + 2) % 3],
                      FLAG_COLORS[i % 3],
                    ]
                  : i === letters.length - 1
                    ? "#003F87"
                    : "#ffffff",
              }}
              transition={{
                duration: 2,
                delay: i * 0.03,
                repeat: hovered ? Infinity : 0,
                ease: "easeInOut",
                times: hovered ? [0, 0.25, 0.5, 0.75, 1] : undefined,
              }}
              whileHover={{
                scale: 1.2,
                color: FLAG_COLORS[i % 3],
                transition: { duration: 0.2 },
              }}
            >
              {isSpace ? "\u00A0" : letter}
            </motion.span>
          );
        })}
      </div>
    </Link>
  );
}
