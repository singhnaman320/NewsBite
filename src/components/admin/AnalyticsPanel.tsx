import type { AnalyticsRow } from "../../types";

type AnalyticsPanelProps = {
  rows: AnalyticsRow[];
};

export const AnalyticsPanel = ({ rows }: AnalyticsPanelProps) => {
  return (
    <section className="glass-card rounded-[2rem] p-6 lg:p-7">
      <div className="mb-5 space-y-2 border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Analytics
        </span>
        <h2 className="text-2xl font-semibold">Campaign performance</h2>
        <p className="text-sm leading-6 text-slate-500">
          A simple table view of ad campaign reach and engagement.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-3 font-semibold">Campaign</th>
              <th className="px-3 py-3 font-semibold">Views</th>
              <th className="px-3 py-3 font-semibold">Clicks</th>
              <th className="px-3 py-3 font-semibold">CTR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row._id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-3 py-4 align-top">
                  <div>
                    <p className="font-semibold text-ink">{row.title}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      {row.topics.join(", ") || "All readers"}
                    </p>
                  </div>
                </td>
                <td className="px-3 py-4 text-slate-700">{row.uniqueViews}</td>
                <td className="px-3 py-4 text-slate-700">{row.totalClicks}</td>
                <td className="px-3 py-4 font-semibold text-pine">
                  {row.ctr}%
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-10 text-center text-sm text-slate-500"
                >
                  Campaign stats will appear here after ad views and clicks
                  start coming in.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
};
