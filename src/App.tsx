import { useEffect, useState } from "react";

import { ToastProvider } from "./components/layout/ToastProvider";
import { api, getStoredSession, setStoredSession } from "./lib/api";
import { AuthScreen } from "./pages/AuthScreen";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserPortal } from "./pages/UserPortal";
import type { AuthResponse } from "./types";

const fallbackTopics = ["General", "World", "Technology", "Business"];

function AppContent() {
  const [session, setSession] = useState<AuthResponse | null>(() =>
    getStoredSession(),
  );
  const [topics, setTopics] = useState<string[]>(fallbackTopics);
  const [booting, setBooting] = useState(Boolean(getStoredSession()));

  const updateSession = (nextSession: AuthResponse | null) => {
    setSession(nextSession);
    setStoredSession(nextSession);
  };

  useEffect(() => {
    const hydrate = async () => {
      if (!session) {
        setBooting(false);
        return;
      }

      try {
        const [meResponse, categoryResponse] = await Promise.all([
          api.me(session.token),
          api.categories(session.token),
        ]);
        const nextSession = {
          ...session,
          user: meResponse.user,
        };
        updateSession(nextSession);
        setTopics(
          categoryResponse.categories.length > 0
            ? categoryResponse.categories
            : fallbackTopics,
        );
      } catch {
        updateSession(null);
      } finally {
        setBooting(false);
      }
    };

    void hydrate();
  }, [session?.token]);

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-medium text-slate-500">
        Loading NewsBite...
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onAuthenticated={updateSession} />;
  }

  if (session.user.role === "admin") {
    return (
      <AdminDashboard
        session={session}
        topics={topics}
        onLogout={() => updateSession(null)}
      />
    );
  }

  return (
    <UserPortal
      session={session}
      categories={topics}
      onSessionChange={updateSession}
      onLogout={() => updateSession(null)}
    />
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
