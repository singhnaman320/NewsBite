type FeedTabsProps = {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
};

export const FeedTabs = ({ tabs, activeTab, onChange }: FeedTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const active = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              active
                ? "bg-ink text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
