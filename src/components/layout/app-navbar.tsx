"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  LineChart,
  TrendingUp,
  GitCompare,
  Star,
  History,
  BookOpen,
  Info,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/converter", label: "Converter", icon: ArrowLeftRight },
  { href: "/rates", label: "Live Rates", icon: LineChart },
  { href: "/historical", label: "Historical", icon: TrendingUp },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/history", label: "History", icon: History },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
] as const;

function NavItem({
  href,
  label,
  icon: Icon,
  onClick,
  compact,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const active =
    mounted &&
    (pathname === href ||
      (href !== "/dashboard" && pathname.startsWith(href)));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2 font-medium outline-none transition-all duration-200 ease-out",
        "hover:text-white active:scale-[0.97] active:duration-100",
        compact
          ? "rounded-lg px-3 py-2.5 text-sm"
          : "rounded-md px-3 py-2 text-xs xl:text-sm",
        active ? "text-white" : "text-slate-400"
      )}
    >
      {compact && active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg bg-blue-500/10"
        />
      )}

      <Icon
        className={cn(
          "relative shrink-0 transition-all duration-200",
          compact ? "size-4" : "size-3.5 xl:size-4",
          active
            ? "text-blue-400"
            : "text-slate-500 group-hover:scale-110 group-hover:text-blue-300"
        )}
      />
      <span className="relative whitespace-nowrap transition-colors duration-200">
        {label}
      </span>

      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-2 right-2 h-0.5 origin-center rounded-full bg-blue-500 transition-all duration-200 ease-out",
          active
            ? "scale-x-100 opacity-100"
            : "scale-x-0 opacity-0 group-hover:scale-x-75 group-hover:opacity-50"
        )}
      />
    </Link>
  );
}

export function AppNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-[#0A192F] pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex h-12 items-center gap-3 px-3 sm:h-14 sm:gap-4 sm:px-5 lg:px-6 xl:max-w-[1600px]">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2 transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 sm:size-9">
            <Globe className="size-4 text-white sm:size-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-white sm:text-lg">
            ExchangeHub
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle variant="inverse" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-white transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="px-3 py-3 lg:hidden sm:px-5"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                compact
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
