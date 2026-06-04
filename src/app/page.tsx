"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Cpu,
  Crosshair,
  Download,
  ExternalLink,
  GraduationCap,
  Languages,
  MapPin,
  MessageSquare,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const founder = SITE_CONFIG.founder;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
          <div className="hero-glow top-1/4 left-1/4 bg-rwanda-green" />
          <div className="hero-glow top-1/3 right-1/4 bg-rwanda-yellow" />
          <div className="hero-glow bottom-1/4 left-1/3 bg-rwanda-blue" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs animate-fade-in">
              <MapPin className="h-3 w-3 mr-1.5 text-rwanda-green" />
              Kigali, Rwanda
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 text-balance">
              Bizimana{" "}
              <span className="gradient-text">Fils</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed"
          >
            {founder.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-dark-400 max-w-xl mx-auto mb-10 text-sm leading-relaxed"
          >
            {SITE_CONFIG.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/projects">
              <Button variant="gradient" size="lg" className="gap-2 group">
                View Projects
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="gap-2">
                About Me
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost" size="lg" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </Button>
            </Link>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { label: founder.hero_stat_1_label || "Experience", value: founder.hero_stat_1_value || "5+" },
              { label: founder.hero_stat_2_label || "Projects", value: founder.hero_stat_2_value || "20+" },
              { label: founder.hero_stat_3_label || "Technologies", value: founder.hero_stat_3_value || "15+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl glass-strong backdrop-blur-xl">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-[10px] text-dark-400 mt-0.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 flex items-center justify-center gap-6 text-dark-500"
          >
            {founder.languages.map((lang: string) => (
              <span key={lang} className="flex items-center gap-1.5 text-xs">
                <Languages className="h-3 w-3" />
                {lang}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="h-8 w-5 rounded-full border-2 border-dark-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-2 w-1 rounded-full bg-dark-400"
            />
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-24 relative">
        <div className="imigongo-pattern absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            <Badge variant="outline" className="mb-4"><Sparkles className="h-3 w-3 mr-1.5" /> Expertise</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Skills & <span className="gradient-text">Competencies</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mb-12">
              Specialized expertise spanning automotive technology, EV systems, and modern web development
            </p>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {founder.skills.map((skill: string) => (
              <motion.div key={skill} {...fadeInUp} className="group">
                <Card className="premium-card h-full hover:border-rwanda-blue/30 transition-all duration-300 hover:shadow-lg hover:shadow-rwanda-blue/5 cursor-default">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-lg bg-rwanda-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-5 w-5 text-rwanda-blue" />
                    </div>
                    <h3 className="font-display font-semibold text-white mb-2">{skill}</h3>
                    <div className="h-1 w-full rounded-full bg-dark-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${70 + Math.random() * 30}%` }}
                        viewport={{ once: true }}
                        className="h-full rounded-full bg-gradient-to-r from-rwanda-green via-rwanda-yellow to-rwanda-blue"
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            <Badge variant="outline" className="mb-4"><BookOpen className="h-3 w-3 mr-1.5" /> Background</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Education & <span className="gradient-text">Background</span>
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="mt-12">
            <Card className="max-w-2xl gradient-border overflow-hidden premium-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-xl bg-rwanda-green/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-7 w-7 text-rwanda-green" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white mb-1">
                      {founder.education}
                    </h3>
                    <p className="text-rwanda-blue text-sm font-medium mb-3">
                      {founder.school}
                    </p>
                    <p className="text-dark-400 text-sm leading-relaxed">
                      Comprehensive training in automobile technology with hands-on experience in
                      vehicle diagnostics, EV systems, and modern automotive engineering practices.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Vehicle Diagnostics", "EV Systems", "Automotive Engineering", "Mechanical Systems"].map(
                        (tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {founder.goals.map((goal: string, i: number) => (
              <Card key={i} className="premium-card hover:border-glass-hover transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-lg bg-rwanda-yellow/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Crosshair className="h-5 w-5 text-rwanda-yellow" />
                  </div>
                  <p className="text-dark-300 text-sm leading-relaxed">{goal}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Interests */}
      <section className="py-24 relative">
        <div className="pattern-grid absolute inset-0 opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <Badge variant="outline" className="mb-4"><Sparkles className="h-3 w-3 mr-1.5" /> Innovation</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Technology <span className="gradient-text">Interests</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Exploring the intersection of automotive technology, AI, and modern web solutions
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: "EV Technology", color: "text-rwanda-green" },
              { icon: Cpu, label: "AI & ML", color: "text-rwanda-blue" },
              { icon: Terminal, label: "Web Dev", color: "text-rwanda-yellow" },
              { icon: Code2, label: "Prompt Engineering", color: "text-rwanda-green" },
              { icon: Briefcase, label: "Auto Diagnostics", color: "text-rwanda-blue" },
              { icon: Download, label: "Tech Research", color: "text-rwanda-yellow" },
              { icon: Zap, label: "Renewable Energy", color: "text-rwanda-green" },
              { icon: Cpu, label: "Smart Systems", color: "text-rwanda-blue" },
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp}>
                <Card className="premium-card text-center hover:border-rwanda-blue/30 transition-all duration-300 group cursor-default">
                  <CardContent className="p-6">
                    <item.icon className={`h-8 w-8 mx-auto mb-3 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                    <p className="text-sm text-dark-300 font-medium">{item.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            <Card className="gradient-border overflow-hidden premium-card">
              <CardContent className="p-12 sm:p-16 text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                  Let&apos;s Work <span className="gradient-text">Together</span>
                </h2>
                <p className="text-dark-400 max-w-md mx-auto mb-8">
                  Have a project in mind? Let&apos;s collaborate and build something innovative.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/messages">
                    <Button variant="gradient" size="lg" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Send Message
                    </Button>
                  </Link>
                  <Link href="/files">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Download className="h-4 w-4" />
                      Browse Files
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
