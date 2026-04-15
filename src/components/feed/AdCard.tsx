import { useEffect, useRef } from "react";

import type { AdCampaign } from "../../types";

type AdCardProps = {
  ad: AdCampaign;
  onView: (adId: string) => Promise<void>;
  onClick: (adId: string) => Promise<void>;
};

export const AdCard = ({ ad, onView, onClick }: AdCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const seenRef = useRef(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seenRef.current) {
            seenRef.current = true;
            void onView(ad._id);
          }
        });
      },
      { threshold: 0.55 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ad._id, onView]);

  const handleClick = async () => {
    await onClick(ad._id);
    window.open(ad.targetLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={cardRef} className="overflow-hidden rounded-[2rem] border border-accent/20 bg-amber-50 shadow-editorial">
      <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
        <img src={ad.imageUrl} alt={ad.title} className="h-full min-h-56 w-full object-cover" />
        <div className="flex flex-col justify-between gap-5 p-6">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full border border-accent/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Sponsored
            </span>
            <div>
              <h3 className="text-3xl font-semibold">{ad.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{ad.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ad.topics.length > 0 ? ad.topics.map((topic) => (
                <span key={topic} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {topic}
                </span>
              )) : <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">All readers</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            {ad.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
