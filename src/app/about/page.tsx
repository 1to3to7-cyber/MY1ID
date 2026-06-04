"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  Code,
  Download,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Quote,
  User,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function AboutPage() {
  const founder = SITE_CONFIG.founder;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeInUp} className="mb-16">
          <Badge variant="outline" className="mb-4">
            <User className="h-3 w-3 mr-1.5" />
            About
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Who is <span className="gradient-text">Bizimana Fils</span>?
          </h1>
          <p className="text-dark-400 max-w-2xl text-lg leading-relaxed">
            A passionate Electrical Vehicle Technician and innovation technologist from Kigali, Rwanda,
            dedicated to bridging automotive technology with cutting-edge digital solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Profile Card */}
          <motion.div {...fadeInUp} className="lg:col-span-1">
            <Card className="sticky top-28">
              <CardContent className="p-8 text-center">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-rwanda-green via-rwanda-yellow to-rwanda-blue p-[2px] mx-auto mb-6">
                  <div className="h-full w-full rounded-2xl bg-dark-950 flex items-center justify-center">
                    <span className="font-display text-4xl font-bold gradient-text">BF</span>
                  </div>
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-1">{founder.name}</h2>
                <p className="text-dark-400 text-sm mb-4">{founder.role}</p>
                <div className="flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <MapPin className="h-4 w-4 text-rwanda-green" />
                    {founder.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Languages className="h-4 w-4 text-rwanda-blue" />
                    {founder.languages.join(", ")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Mail className="h-4 w-4 text-rwanda-yellow" />
                    {founder.email}
                  </div>
                </div>
                <Separator className="my-6" />
                <Link href="/messages">
                  <Button variant="gradient" className="w-full gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Me
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <motion.div {...fadeInUp}>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-5 w-5 text-rwanda-blue" />
                    <h3 className="font-display text-xl font-semibold text-white">Biography</h3>
                  </div>
                  <div className="space-y-4 text-dark-300 text-sm leading-relaxed">
                    <p>
                      Born and raised in Kigali, Rwanda, Bizimana Fils developed a passion for
                      technology and innovation at an early age. His journey began with a deep
                      curiosity about how things work, leading him to pursue formal education in
                      Automobile Technology at Ecole Technique de Kabgayi.
                    </p>
                    <p>
                      As an Electrical Vehicle Technician, Bizimana specializes in vehicle diagnostics,
                      EV systems, and modern automotive technologies. His work is driven by a vision
                      to accelerate the adoption of electric vehicles across East Africa, making
                      sustainable transportation accessible to all.
                    </p>
                    <p>
                      Beyond automotive technology, Bizimana is an avid AI enthusiast and web
                      development practitioner. He believes in the power of technology to transform
                      lives and is committed to contributing to Rwanda&apos;s growing tech ecosystem.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Education */}
            <motion.div {...fadeInUp}>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <GraduationCap className="h-5 w-5 text-rwanda-green" />
                    <h3 className="font-display text-xl font-semibold text-white">Education</h3>
                  </div>
                  <div className="relative pl-8 border-l-2 border-glass-border">
                    <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-rwanda-green border-2 border-dark-950" />
                    <div className="mb-8">
                      <h4 className="font-semibold text-white">{founder.education}</h4>
                      <p className="text-rwanda-blue text-sm font-medium">{founder.school}</p>
                      <p className="text-dark-400 text-xs mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Completed
                      </p>
                      <p className="text-dark-400 text-sm mt-2">
                        Comprehensive training in automobile technology with specialization in vehicle
                        diagnostics, electrical systems, and mechanical engineering.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills */}
            <motion.div {...fadeInUp}>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="h-5 w-5 text-rwanda-yellow" />
                    <h3 className="font-display text-xl font-semibold text-white">Expertise</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {founder.skills.map((skill) => (
                      <div key={skill} className="flex items-center gap-3 p-3 rounded-lg bg-glass hover:bg-glass-hover transition-colors duration-200">
                        <Award className="h-4 w-4 text-rwanda-blue shrink-0" />
                        <span className="text-sm text-dark-200">{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals */}
            <motion.div {...fadeInUp}>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Quote className="h-5 w-5 text-rwanda-green" />
                    <h3 className="font-display text-xl font-semibold text-white">Goals & Vision</h3>
                  </div>
                  <div className="space-y-4">
                    {founder.goals.map((goal, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-glass">
                        <div className="h-8 w-8 rounded-full bg-rwanda-blue/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-rwanda-blue">{i + 1}</span>
                        </div>
                        <p className="text-dark-300 text-sm">{goal}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div {...fadeInUp}>
              <Card className="gradient-border">
                <CardContent className="p-8 text-center">
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Want to know more?
                  </h3>
                  <p className="text-dark-400 text-sm mb-6">
                    Check out my projects, browse downloadable files, or send me a message.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/projects">
                      <Button variant="gradient" className="gap-2">
                        <Code className="h-4 w-4" />
                        View Projects
                      </Button>
                    </Link>
                    <Link href="/files">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Browse Files
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
