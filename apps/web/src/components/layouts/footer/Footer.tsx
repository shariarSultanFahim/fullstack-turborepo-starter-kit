import Link from "next/link";

import { Github, Package, Terminal } from "lucide-react";

import { siteConfig } from "@/config/site";

import { Separator } from "@/ui";

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t py-10">
      <div className="container flex flex-col gap-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <Package className="text-primary h-5 w-5" />
            <span>Next.js & Express.js Turborepo Boilerplate</span>
          </div>

          <div className="text-muted-foreground flex items-center gap-6 text-sm">
            <Link
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            <Link
              href="https://turbo.build/repo/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Turborepo Docs
            </Link>
            <Link
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Next.js Docs
            </Link>
            <Link
              href="https://www.prisma.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Prisma Docs
            </Link>
          </div>
        </div>

        <Separator />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-xs sm:flex-row">
          <p>
            Created by{" "}
            <Link
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary font-medium underline underline-offset-4"
            >
              {siteConfig.author}
            </Link>
            . Open source under MIT License.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5" />
              <span>Turborepo v2</span>
            </span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
