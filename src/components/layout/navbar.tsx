"use client";

import { cn } from "@/lib/utils";
import { SITE_CONFIG, FLAG_COLORS } from "@/lib/constants";
import { useUser } from "@/hooks/useUser";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  Menu,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, loading: authLoading } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  const isHome = pathname === "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || mobileOpen
          ? "bg-dark-950/95 backdrop-blur-2xl border-b border-glass-border shadow-2xl shadow-black/10"
          : isHome
            ? "bg-transparent"
            : "bg-dark-950/80 backdrop-blur-md"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rwanda-green via-rwanda-yellow to-rwanda-blue flex items-center justify-center shadow-lg shadow-rwanda-green/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-sm font-bold text-white">BF</span>
            </div>
            <span className="font-display text-lg font-bold text-white hidden sm:block">
              Bizimana<span className="text-rwanda-blue">.</span>
            </span>
            {/* Glow on hover */}
            <div className="absolute -inset-4 bg-rwanda-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {SITE_CONFIG.navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                    active
                      ? "text-white"
                      : "text-dark-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}

            {/* Admin / Auth buttons */}
            {isAdmin ? (
              <Link
                href="/dashboard"
                className="ml-3 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-rwanda-blue/20 to-rwanda-green/20 text-white border border-rwanda-blue/30 hover:from-rwanda-blue/30 hover:to-rwanda-green/30 transition-all duration-200 shadow-lg shadow-rwanda-blue/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
            ) : !authLoading && !user ? (
              <Link
                href="/auth"
                className="ml-3 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl glass text-dark-300 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            ) : null}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden relative z-50 p-2.5 rounded-xl transition-all duration-200",
              mobileOpen
                ? "bg-white/10 text-white"
                : "text-dark-300 hover:text-white hover:bg-white/5"
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-0 z-40 bg-dark-950/98 backdrop-blur-2xl"
          >
            <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
              <div className="flex-1 space-y-1">
                {SITE_CONFIG.navItems.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-medium transition-all duration-200",
                          active
                            ? "text-white bg-gradient-to-r from-rwanda-blue/20 to-rwanda-green/10 border border-rwanda-blue/20"
                            : "text-dark-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className={cn(
                          "h-2 w-2 rounded-full transition-all duration-300",
                          active ? "bg-rwanda-blue scale-100" : "bg-dark-600 scale-0"
                        )} />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Auth Section */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                {isAdmin ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-rwanda-blue/20 to-rwanda-green/20 text-white border border-rwanda-blue/30 font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                  </motion.div>
                ) : !authLoading ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/auth"
                      className="flex items-center gap-3 px-5 py-4 rounded-2xl glass text-dark-200 border border-white/10 font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </Link>
                  </motion.div>
                ) : null}

                {/* Rwanda flag in mobile */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <span className="h-0.5 w-3 rounded bg-rwanda-green" />
                  <span className="h-0.5 w-3 rounded bg-rwanda-yellow" />
                  <span className="h-0.5 w-3 rounded bg-rwanda-blue" />
                  <span className="text-xs text-dark-500 ml-1">Rwanda</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
