# Bizimana Fils Web Pro — Premium SaaS Portfolio

A futuristic African luxury SaaS portfolio platform for **Bizimana Fils**, Rwandan EV Technician and Innovation Technologist.

Built with Next.js 16, React 19, TypeScript, Supabase, Framer Motion, and Tailwind CSS 4.

## Features

- 🏠 **Public pages**: Home, About, Projects, Files, Quotes, Contact
- 🖼️ **Visit Rwanda** sliding background with cross-fade transitions
- 🔐 **Admin Dashboard**: Manage projects, files, quotes, messages, comments, analytics
- 📊 **Analytics**: 30-day visitor chart, device breakdown, country map, CSV export
- 💬 **Quotes**: Inspirational quotes with like/share, dashboard CRUD
- 🎨 **RwandaLoader**: Cultural loading animations (Imigongo, Agaseke, Flag, Kinyarwanda text)
- 🛡️ **Security**: Supabase Auth, RLS policies, login rate limiting, activity logging, security headers
- 📱 **Responsive**: Full mobile optimization with premium glassmorphism design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Database**: Supabase (PostgreSQL + Storage + Auth)
- **Charts**: Recharts
- **Validation**: Zod
- **UI**: Radix UI primitives + Custom components

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in Supabase credentials.

## Deploy

Push to GitHub, import into Vercel, add environment variables.
