import type { PropsWithChildren, ReactNode } from "react";

import { SiteShell } from "./SiteShell";

type AppFrameProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  actions?: ReactNode;
}>;

export const AppFrame = ({
  title,
  subtitle,
  actions,
  children,
}: AppFrameProps) => {
  return (
    <SiteShell>
      <div className="space-y-8">
        <header className="glass-card news-grid overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                NewsBite
              </span>
              <div>
                <h1 className="text-3xl font-semibold sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  {subtitle}
                </p>
              </div>
            </div>
            {actions ? (
              <div className="flex flex-wrap items-center gap-3">{actions}</div>
            ) : null}
          </div>
        </header>
        {children}
      </div>
    </SiteShell>
  );
};
