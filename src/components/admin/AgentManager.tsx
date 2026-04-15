import { FormEvent, useMemo, useState } from "react";

import type { Agent } from "../../types";

type AgentManagerProps = {
  agents: Agent[];
  topics: string[];
  onSave: (agent: Partial<Agent>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRun: (id: string) => Promise<void>;
};

const blankAgent = {
  sourceName: "",
  topic: "General",
  category: "Top Stories",
  rssUrl: "",
  description: "",
  fetchIntervalMinutes: 15,
  isActive: true,
};

export const AgentManager = ({
  agents,
  topics,
  onSave,
  onDelete,
  onRun,
}: AgentManagerProps) => {
  const [draft, setDraft] = useState<Partial<Agent>>(blankAgent);

  const title = useMemo(
    () => (draft._id ? "Edit feed agent" : "Create feed agent"),
    [draft._id],
  );
  const activeAgents = agents.filter((agent) => agent.isActive).length;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(draft);
    setDraft(blankAgent);
  };

  return (
    <section className="grid items-stretch gap-6 xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[390px_minmax(0,1fr)]">
      <form
        className="glass-card flex h-full flex-col rounded-[2rem] p-6"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Agents
          </span>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm leading-6 text-slate-500">
            Add or update RSS feed sources used by the reader app.
          </p>
        </div>

        <div className="grid gap-4">
          <input
            value={draft.sourceName ?? ""}
            onChange={(e) =>
              setDraft((cur) => ({ ...cur, sourceName: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="Source name"
            required
          />
          <select
            value={draft.topic ?? "General"}
            onChange={(e) =>
              setDraft((cur) => ({ ...cur, topic: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
          >
            {topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
          <input
            value={draft.category ?? ""}
            onChange={(e) =>
              setDraft((cur) => ({ ...cur, category: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="Category label"
            required
          />
          <input
            value={draft.rssUrl ?? ""}
            onChange={(e) =>
              setDraft((cur) => ({ ...cur, rssUrl: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="RSS feed URL"
            required
          />
          <textarea
            value={draft.description ?? ""}
            onChange={(e) =>
              setDraft((cur) => ({ ...cur, description: e.target.value }))
            }
            className="min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="Description"
            required
          />
          <input
            value={draft.fetchIntervalMinutes ?? 15}
            onChange={(e) =>
              setDraft((cur) => ({
                ...cur,
                fetchIntervalMinutes: Number(e.target.value),
              }))
            }
            type="number"
            min={5}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="Fetch interval"
            required
          />
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={draft.isActive ?? true}
              onChange={(e) =>
                setDraft((cur) => ({ ...cur, isActive: e.target.checked }))
              }
            />
            Active
          </label>
        </div>

        <div className=" pt-5">
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              {draft._id ? "Update agent" : "Create agent"}
            </button>
            {draft._id ? (
              <button
                type="button"
                onClick={() => setDraft(blankAgent)}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>
      </form>

      <div className="glass-card flex h-full flex-col rounded-[2rem] p-5 lg:p-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Feed Library
          </span>
          <h2 className="mt-2 text-2xl font-semibold">
            Configured feed agents
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {activeAgents} active of {agents.length} total sources.
          </p>
        </div>

        <div className="mt-5 max-h-[50rem] flex-1 space-y-3 overflow-y-auto pr-2">
          {agents.map((agent) => (
            <article
              key={agent._id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    <span>{agent.topic}</span>
                    <span>{agent.category}</span>
                    <span>{agent.fetchIntervalMinutes} min</span>
                    <span
                      className={
                        agent.isActive ? "text-pine" : "text-slate-400"
                      }
                    >
                      {agent.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {agent.sourceName}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {agent.description}
                    </p>
                  </div>
                  <a
                    href={agent.rssUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-sm font-medium text-accent"
                  >
                    {agent.rssUrl}
                  </a>
                </div>

                <div className="flex shrink-0 flex-nowrap items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => setDraft(agent)}
                    className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onRun(agent._id)}
                    className="whitespace-nowrap rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white"
                  >
                    Run now
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(agent._id)}
                    className="whitespace-nowrap rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
