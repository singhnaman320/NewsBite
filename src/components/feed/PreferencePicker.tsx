import { useMemo, useState } from "react";

type PreferencePickerProps = {
  categories: string[];
  loading: boolean;
  onSubmit: (preferences: string[]) => Promise<void>;
};

export const PreferencePicker = ({
  categories,
  loading,
  onSubmit,
}: PreferencePickerProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const canSubmit = useMemo(
    () => selected.length > 0 && !loading,
    [loading, selected.length],
  );

  const toggle = (category: string) => {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  return (
    <section className="glass-card rounded-[2rem] p-6 sm:p-8">
      <div className="mb-5 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Onboarding
        </span>
        <h2 className="text-3xl font-semibold">Shape your personal edition</h2>
        <p>
          Pick the categories you care about first. We&apos;ll use them to build
          your For You tab and inject relevant campaigns.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const active = selected.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggle(category)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                active
                  ? "border-pine bg-pine text-white"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSubmit(selected)}
        disabled={!canSubmit}
        className="mt-6 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving preferences..." : "Start reading"}
      </button>
    </section>
  );
};
