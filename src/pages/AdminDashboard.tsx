import { useEffect, useState } from "react";

import { AnalyticsPanel } from "../components/admin/AnalyticsPanel";
import { AdManager } from "../components/admin/AdManager";
import { AgentManager } from "../components/admin/AgentManager";
import { AppFrame } from "../components/layout/AppFrame";
import { useToast } from "../components/layout/ToastProvider";
import { api } from "../lib/api";
import type { AdCampaign, Agent, AnalyticsRow, AuthResponse } from "../types";

type AdminDashboardProps = {
  session: AuthResponse;
  topics: string[];
  onLogout: () => void;
};

export const AdminDashboard = ({
  session,
  topics,
  onLogout,
}: AdminDashboardProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadDashboard = async (showLoadErrorToast = true) => {
    try {
      setLoading(true);
      const [agentsResponse, adsResponse, analyticsResponse] =
        await Promise.all([
          api.agents(session.token),
          api.ads(session.token),
          api.analytics(session.token),
        ]);
      setAgents(agentsResponse.agents);
      setAds(adsResponse.ads);
      setAnalytics(analyticsResponse.analytics);
    } catch (loadError) {
      if (showLoadErrorToast) {
        showToast({
          title:
            loadError instanceof Error
              ? loadError.message
              : "Failed to load dashboard data.",
          tone: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard(false);
  }, []);

  const wrapAction = async (
    action: () => Promise<string | undefined>,
    fallbackSuccessMessage: string,
  ) => {
    try {
      const successMessage = await action();
      showToast({
        title: successMessage ?? fallbackSuccessMessage,
        tone: "success",
      });
      await loadDashboard(false);
    } catch (actionError) {
      showToast({
        title:
          actionError instanceof Error
            ? actionError.message
            : "Something went wrong.",
        tone: "error",
      });
    }
  };

  return (
    <AppFrame
      title="Admin command center"
      subtitle="Manage feed agents, launch ads, and monitor campaign analytics from one secure dashboard."
      actions={
        <>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Refresh
          </button>
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
      {loading ? (
        <div className="glass-card rounded-[2rem] p-8 text-sm text-slate-500">
          Loading dashboard...
        </div>
      ) : null}

      <AgentManager
        agents={agents}
        topics={topics}
        onSave={(agent) =>
          wrapAction(async () => {
            const response = await api.saveAgent(session.token, agent);
            return response.message;
          }, "Feed agent saved successfully.")
        }
        onDelete={(id) =>
          wrapAction(async () => {
            const response = await api.deleteAgent(session.token, id);
            return response.message;
          }, "Feed agent deleted successfully.")
        }
        onRun={(id) =>
          wrapAction(async () => {
            const result = await api.runAgent(session.token, id);
            return result.message;
          }, "Feed agent run completed.")
        }
      />

      <AdManager
        ads={ads}
        topics={topics}
        onSave={(ad) =>
          wrapAction(async () => {
            const response = await api.saveAd(session.token, ad);
            return response.message;
          }, "Ad campaign saved successfully.")
        }
        onDelete={(id) =>
          wrapAction(async () => {
            const response = await api.deleteAd(session.token, id);
            return response.message;
          }, "Ad campaign deleted successfully.")
        }
      />

      <AnalyticsPanel rows={analytics} />
    </AppFrame>
  );
};
