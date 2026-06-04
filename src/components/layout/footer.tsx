"use client";

import { SITE_CONFIG, FLAG_COLORS } from "@/lib/constants";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const f = SITE_CONFIG.founder;

  return (
    <footer className="relative border-t border-glass-border bg-dark-950/90 backdrop-blur-2xl">
      {/* Top decorative flag bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-rwanda-green via-rwanda-yellow to-rwanda-blue" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rwanda-green via-rwanda-yellow to-rwanda-blue flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">BF</span>
              </div>
              <span className="font-display text-lg font-bold text-white">
                Bizimana<span className="text-rwanda-blue">.</span>
              </span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed mb-4 max-w-xs">
              {SITE_CONFIG.tagline}
            </p>
            {/* Rwanda flag mini */}
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-5 rounded-sm" style={{ backgroundColor: FLAG_COLORS.green }} />
              <span className="h-2.5 w-5 rounded-sm" style={{ backgroundColor: FLAG_COLORS.yellow }} />
              <span className="h-2.5 w-5 rounded-sm" style={{ backgroundColor: FLAG_COLORS.blue }} />
              <span className="text-xs text-dark-500 ml-1 font-medium">Visit Rwanda</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {SITE_CONFIG.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-dark-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-dark-400 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-rwanda-green mt-0.5 shrink-0" />
                <span>{f.location}</span>
              </li>
              <li>
                <a
                  href={`mailto:${f.email}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors duration-200 group"
                >
                  <Mail className="h-4 w-4 text-rwanda-blue shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{f.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-rwanda-yellow shrink-0" />
                <span>{f.phone}</span>
              </li>
            </ul>
          </div>

          {/* Social & Copyright */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: "GitHub", href: SITE_CONFIG.social.github },
                { label: "X / Twitter", href: SITE_CONFIG.social.twitter },
                { label: "LinkedIn", href: SITE_CONFIG.social.linkedin },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg glass text-xs text-dark-300 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/20"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <p className="text-dark-500 text-xs leading-relaxed">
              &copy; {new Date().getFullYear()} Bizimana Fils.
              <br />
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-dark-500 text-xs flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 text-rwanda-green fill-rwanda-green/30" /> in Kigali, Rwanda
          </p>
          <p className="text-dark-600 text-[10px] font-mono">
            Ubuhinga ni Ubutunzi — Technology is Wealth
          </p>
        </div>
      </div>
    </footer>
  );
}
