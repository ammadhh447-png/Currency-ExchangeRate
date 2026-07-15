"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pb-4 lg:px-8">
      <Link href="/" className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/25">
          <Globe className="size-5 text-white" />
        </div>
        <span className="truncate text-lg font-bold text-white">ExchangeHub</span>
      </Link>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link href="/about" className="hidden sm:block">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            About
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-500">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
}
