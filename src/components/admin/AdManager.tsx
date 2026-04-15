import { FormEvent, useState } from "react";

import type { AdCampaign } from "../../types";

type AdManagerProps = {
  ads: AdCampaign[];
  topics: string[];
  onSave: (ad: Partial<AdCampaign>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const blankAd = {
  title: "",
  imageUrl: "",
  targetLink: "",
  description: "",
  ctaLabel: "Learn more",
  topics: [] as string[],
  isActive: true
};

export const AdManager = ({ ads, topics, onSave, onDelete }: AdManagerProps) => {
  const [draft, setDraft] = useState<Partial<AdCampaign>>(blankAd);

  const handleTopicToggle = (topic: string) => {
    setDraft((current) => ({
      ...current,
      topics: current.topics?.includes(topic)
        ? current.topics.filter((item) => item !== topic)
        : [...(current.topics ?? []), topic]
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(draft);
    setDraft(blankAd);
  };

  return (
    <section className="grid items-stretch gap-6 xl:grid-cols-2">
      <form className="glass-card h-full rounded-[2rem] p-6 lg:p-7" onSubmit={handleSubmit}>
        <div className="mb-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Campaigns</span>
          <h2 className="text-2xl font-semibold">{draft._id ? "Edit ad campaign" : "Launch a new campaign"}</h2>
          <p className="text-sm leading-6 text-slate-500">Create sponsored placements that can be inserted into the personalized feed.</p>
        </div>

        <div className="grid gap-4">
          <input value={draft.title ?? ""} onChange={(e) => setDraft((cur) => ({ ...cur, title: e.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Campaign title" required />
          <input value={draft.imageUrl ?? ""} onChange={(e) => setDraft((cur) => ({ ...cur, imageUrl: e.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Image URL" required />
          <input value={draft.targetLink ?? ""} onChange={(e) => setDraft((cur) => ({ ...cur, targetLink: e.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Target link" required />
          <textarea value={draft.description ?? ""} onChange={(e) => setDraft((cur) => ({ ...cur, description: e.target.value }))} className="min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Campaign description" required />
          <input value={draft.ctaLabel ?? "Learn more"} onChange={(e) => setDraft((cur) => ({ ...cur, ctaLabel: e.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="CTA label" required />
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const active = draft.topics?.includes(topic);
              return (
                <button key={topic} type="button" onClick={() => handleTopicToggle(topic)} className={`rounded-full px-3 py-2 text-sm font-semibold ${active ? "bg-pine text-white" : "bg-slate-100 text-slate-700"}`}>
                  {topic}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={draft.isActive ?? true} onChange={(e) => setDraft((cur) => ({ ...cur, isActive: e.target.checked }))} />
            Campaign is active
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">{draft._id ? "Update ad" : "Create ad"}</button>
          {draft._id ? <button type="button" onClick={() => setDraft(blankAd)} className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">Reset</button> : null}
        </div>
      </form>

      <div className="glass-card h-full rounded-[2rem] p-5 lg:p-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Live creatives</span>
          <h3 className="mt-2 text-2xl font-semibold">Existing campaigns</h3>
          <p className="mt-1 text-sm text-slate-500">Review active creatives and jump back into edit mode quickly.</p>
        </div>

        <div className="mt-5 space-y-3">
          {ads.map((ad) => (
            <article key={ad._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-4">
                <img src={ad.imageUrl} alt={ad.title} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-tight">{ad.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{ad.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ad.topics.length > 0 ? ad.topics.map((topic) => <span key={topic} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{topic}</span>) : <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">All readers</span>}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setDraft(ad)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Edit</button>
                <button type="button" onClick={() => onDelete(ad._id)} className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

