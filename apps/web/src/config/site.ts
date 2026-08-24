import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

export const siteConfig: SiteConfig = {
  name: "Turborepo Next.js & Express.js Boilerplate",
  description:
    "Production-ready Full-Stack Monorepo starter built with Next.js 16, Express.js, TypeScript, Tailwind CSS 4, and Prisma.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "Shariar Sultan Fahim",
  locale: "en",
  themeColor: "#000000",
  keywords: [
    "nextjs",
    "expressjs",
    "turborepo",
    "typescript",
    "tailwindcss",
    "prisma",
    "shadcn",
    "boilerplate",
    "starter"
  ],
  social: {
    twitter: "",
    github: "https://github.com/shariarSultanFahim",
    linkedin: "https://www.linkedin.com/in/shariarsultan"
  },
  ogImage: "/og.jpg"
} as const;
