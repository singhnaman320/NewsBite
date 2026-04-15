import type { PropsWithChildren, ReactNode } from "react";

type SiteShellProps = PropsWithChildren<{
  headerSlot?: ReactNode;
}>;

export const SiteShell = ({ headerSlot, children }: SiteShellProps) => {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1480px] flex-col gap-6">
        <header className="glass-card rounded-[1.75rem] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div>
                <span className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-accent">
                  NewsBite
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 sm:gap-5">
                <span>Personalized feeds</span>
                <span>Ad campaigns</span>
                <span>Reader analytics</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-slate-500 lg:justify-end">
              <span className="hidden sm:inline">
                TypeScript MERN and Tailwind build
              </span>
              {headerSlot}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="glass-card rounded-[1.75rem] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              NewsBite dashboard and reader experience for the MERN full-stack
              assignment.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              <span>JWT auth</span>
              <span>RSS agents</span>
              <span>MongoDB</span>
              <span>React + Vite</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
