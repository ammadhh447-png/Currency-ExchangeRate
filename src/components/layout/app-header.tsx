export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="shrink-0 bg-background px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        <div
          aria-hidden
          className="mx-auto mt-2 h-px w-10 bg-gradient-to-r from-transparent via-blue-500/45 to-transparent"
        />
        {subtitle && (
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
