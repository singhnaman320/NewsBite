import { useEffect, useState } from "react";

import { AuthForm } from "../components/auth/AuthForm";
import { SiteShell } from "../components/layout/SiteShell";
import { useToast } from "../components/layout/ToastProvider";
import { api } from "../lib/api";
import type { AuthResponse, AuthSetupStatus, Role } from "../types";

type AuthScreenProps = {
  onAuthenticated: (session: AuthResponse) => void;
};

const defaultSetupStatus: AuthSetupStatus = {
  hasAdmin: false,
  canRegisterAdmin: true,
  registerRoles: ["user", "admin"],
  loginRoles: ["user", "admin"]
};

export const AuthScreen = ({ onAuthenticated }: AuthScreenProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState<AuthSetupStatus>(defaultSetupStatus);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadSetupStatus = async () => {
      try {
        const status = await api.authSetupStatus();
        setSetupStatus(status);
      } catch {
        showToast({ title: "Unable to load authentication options right now.", tone: "error" });
      } finally {
        setCheckingSetup(false);
      }
    };

    void loadSetupStatus();
  }, [showToast]);

  const refreshSetupStatus = async () => {
    const status = await api.authSetupStatus();
    setSetupStatus(status);
  };

  const handleSubmit = async (payload: { name?: string; email: string; password: string; role?: Role }) => {
    try {
      setLoading(true);

      if (mode === "login") {
        const response = await api.login({ email: payload.email, password: payload.password, role: payload.role });
        await refreshSetupStatus();
        showToast({ title: response.message ?? "Login successful.", tone: "success" });
        onAuthenticated(response);
        return;
      }

      const response = await api.register({
        name: payload.name ?? "NewsBite Reader",
        email: payload.email,
        password: payload.password,
        role: payload.role ?? "user"
      });

      await refreshSetupStatus();
      setMode("login");
      showToast({ title: response.message ?? "Registration completed successfully. Please log in to continue.", tone: "success" });
    } catch (authError) {
      showToast({
        title: authError instanceof Error ? authError.message : "Authentication failed.",
        tone: "error"
      });
      await refreshSetupStatus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <section className="news-grid glass-card overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-accent">
                Senior MERN Assignment
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">NewsBite turns RSS streams into a personalized full-stack news product.</h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Two distinct portals, JWT auth, Mongo-backed feed agents, infinite scroll, ad injection, and campaign analytics are all wired into one TypeScript codebase.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Portal 1</p>
                <h2 className="mt-3 text-2xl font-semibold">Admin dashboard</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Create feed agents, launch campaigns, run syncs manually, and inspect CTR in one place.</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Portal 2</p>
                <h2 className="mt-3 text-2xl font-semibold">Reader app</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Select topics, browse tabbed feeds, save articles, and trigger tracked sponsored placements.</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-ink p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Registration rules</p>
              <p className="mt-3 text-lg font-semibold">Only one admin can exist at a time.</p>
              <p className="text-sm text-white/70">
                {checkingSetup
                  ? "Checking current setup..."
                  : setupStatus.canRegisterAdmin
                    ? "Admin registration is currently open."
                    : "An admin already exists, so new registrations are reader-only."}
              </p>
            </div>
          </div>
        </section>

        <AuthForm
          mode={mode}
          loading={loading || checkingSetup}
          registerRoles={setupStatus.registerRoles}
          loginRoles={setupStatus.loginRoles}
          onModeChange={setMode}
          onSubmit={handleSubmit}
        />
      </div>
    </SiteShell>
  );
};
