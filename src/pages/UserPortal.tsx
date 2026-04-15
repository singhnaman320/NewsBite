import { useEffect, useMemo, useState } from "react";

import { AdCard } from "../components/feed/AdCard";
import { ArticleCard } from "../components/feed/ArticleCard";
import { FeedTabs } from "../components/feed/FeedTabs";
import { PreferencePicker } from "../components/feed/PreferencePicker";
import { AppFrame } from "../components/layout/AppFrame";
import { useToast } from "../components/layout/ToastProvider";
import { api } from "../lib/api";
import type { AuthResponse, FeedItem } from "../types";

type UserPortalProps = {
  session: AuthResponse;
  categories: string[];
  onSessionChange: (session: AuthResponse) => void;
  onLogout: () => void;
};

const feedPageSize = 6;

export const UserPortal = ({
  session,
  categories,
  onSessionChange,
  onLogout,
}: UserPortalProps) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [tabs, setTabs] = useState<string[]>([
    "For You",
    ...session.user.preferences,
    "Saved",
  ]);
  const [activeTab, setActiveTab] = useState("For You");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const { showToast } = useToast();

  const canRead =
    session.user.onboardingCompleted || session.user.preferences.length > 0;
  const savedIds = new Set(session.user.savedArticles);

  const paginationRange = useMemo(() => {
    if (totalPages <= 1) {
      return [] as number[];
    }

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index,
    );
  }, [page, totalPages]);

  const loadFeed = async (
    nextPage: number,
    tabOverride = activeTab,
    showErrorToast = true,
  ) => {
    try {
      setLoadingFeed(true);
      const response = await api.feed(
        session.token,
        tabOverride,
        nextPage,
        feedPageSize,
      );
      setTabs(response.tabs.length > 0 ? response.tabs : ["For You", "Saved"]);
      setItems(response.items);
      setHasMore(response.hasMore);
      setTotalPages(Math.max(1, response.totalPages ?? 1));
      setPage(response.page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (loadError) {
      if (showErrorToast) {
        showToast({
          title:
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your feed.",
          tone: "error",
        });
      }
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    if (!canRead) {
      return;
    }

    void loadFeed(1, activeTab, false);
  }, [activeTab, canRead, session.token, session.user.preferences.join("|")]);

  const handlePreferenceSave = async (preferences: string[]) => {
    try {
      setSavingPreferences(true);
      const response = await api.updatePreferences(session.token, preferences);
      const nextSession = {
        ...session,
        user: response.user,
      };
      onSessionChange(nextSession);
      setTabs(["For You", ...response.user.preferences, "Saved"]);
      setActiveTab("For You");
      setPage(1);
      showToast({
        title: response.message ?? "Your preferences were saved successfully.",
        tone: "success",
      });
    } catch (saveError) {
      showToast({
        title:
          saveError instanceof Error
            ? saveError.message
            : "Unable to save preferences.",
        tone: "error",
      });
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleToggleSave = async (articleId: string) => {
    try {
      const response = await api.toggleSaved(session.token, articleId);
      const nextSession = {
        ...session,
        user: {
          ...session.user,
          savedArticles: response.savedArticles,
        },
      };
      onSessionChange(nextSession);

      if (activeTab === "Saved") {
        const nextPage =
          items.length === 1 && page > 1 && !response.saved ? page - 1 : page;
        void loadFeed(nextPage, activeTab, false);
      }

      showToast({
        title:
          response.message ??
          (response.saved
            ? "Article saved successfully."
            : "Article removed from your saved list."),
        tone: "success",
      });
    } catch (saveError) {
      showToast({
        title:
          saveError instanceof Error
            ? saveError.message
            : "Unable to update saved articles.",
        tone: "error",
      });
    }
  };

  const trackView = async (adId: string) => {
    try {
      await api.trackView(session.token, adId);
    } catch {
      // Tracking should stay invisible to the reader.
    }
  };

  const trackClick = async (adId: string) => {
    try {
      await api.trackClick(session.token, adId);
    } catch {
      // Tracking should stay invisible to the reader.
    }
  };

  return (
    <AppFrame
      title="Your personalized morning edition"
      subtitle="A responsive reader that prioritizes the categories you selected, mixes in sponsored placements, and keeps your saved stories one tap away."
      actions={
        <>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            {session.user.name}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </>
      }
    >
      {!canRead ? (
        <PreferencePicker
          categories={categories}
          loading={savingPreferences}
          onSubmit={handlePreferenceSave}
        />
      ) : (
        <>
          <section className="glass-card rounded-[2rem] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  Reading tabs
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Navigate by preference
                </h2>
              </div>
              <FeedTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={(tab) => {
                  setActiveTab(tab);
                  setPage(1);
                }}
              />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {items.map((item, index) =>
              item.kind === "article" ? (
                <ArticleCard
                  key={`${item.article._id}-${page}-${index}`}
                  article={item.article}
                  saved={savedIds.has(item.article._id)}
                  onToggleSave={handleToggleSave}
                />
              ) : (
                <div
                  key={`${item.ad._id}-${page}-${index}`}
                  className="lg:col-span-2"
                >
                  <AdCard
                    ad={item.ad}
                    onView={trackView}
                    onClick={trackClick}
                  />
                </div>
              ),
            )}
          </section>

          {loadingFeed ? (
            <div className="glass-card rounded-[2rem] p-5 text-sm text-slate-500">
              Loading stories...
            </div>
          ) : null}
          {!loadingFeed && items.length === 0 ? (
            <div className="glass-card rounded-[2rem] p-5 text-sm text-slate-500">
              No stories yet. Seed feeds and trigger an agent run from the admin
              dashboard.
            </div>
          ) : null}

          {!loadingFeed && items.length > 0 && totalPages > 1 ? (
            <section className="glass-card rounded-[2rem] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing page {page} of {totalPages} with {feedPageSize} feed
                  items per page.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void loadFeed(page - 1)}
                    disabled={page <= 1}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {paginationRange.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => void loadFeed(pageNumber)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${pageNumber === page ? "bg-ink text-white" : "border border-slate-200 bg-white text-slate-700"}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => void loadFeed(page + 1)}
                    disabled={!hasMore || page >= totalPages}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </AppFrame>
  );
};
