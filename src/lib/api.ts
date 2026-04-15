import type { AdCampaign, Agent, AnalyticsRow, AuthResponse, AuthSetupStatus, FeedResponse, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const SESSION_KEY = "newsbite-session";

export const getStoredSession = () => {
  const raw = window.localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthResponse) : null;
};

export const setStoredSession = (session: AuthResponse | null) => {
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const request = async <T>(path: string, options: RequestInit = {}, token?: string): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload;
};

export const api = {
  authSetupStatus: () => request<AuthSetupStatus>("/auth/setup-status"),
  register: (body: { name: string; email: string; password: string; role: "admin" | "user" }) =>
    request<AuthResponse & { message?: string }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string; role?: "admin" | "user" }) =>
    request<AuthResponse & { message?: string }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: (token: string) => request<{ user: User }>("/auth/me", {}, token),
  categories: (token: string) => request<{ categories: string[] }>("/feed/categories", {}, token),
  feed: (token: string, tab: string, page: number, limit = 8) =>
    request<FeedResponse>(`/feed?tab=${encodeURIComponent(tab)}&page=${page}&limit=${limit}`, {}, token),
  updatePreferences: (token: string, preferences: string[]) =>
    request<{ user: User; message?: string }>("/users/preferences", {
      method: "PATCH",
      body: JSON.stringify({ preferences })
    }, token),
  toggleSaved: (token: string, articleId: string) =>
    request<{ saved: boolean; savedArticles: string[]; message?: string }>(`/users/saved/${articleId}`, { method: "POST" }, token),
  agents: (token: string) => request<{ agents: Agent[] }>("/admin/agents", {}, token),
  saveAgent: (token: string, body: Partial<Agent>) =>
    body._id
      ? request<{ agent: Agent; message?: string }>(`/admin/agents/${body._id}`, {
          method: "PATCH",
          body: JSON.stringify(body)
        }, token)
      : request<{ agent: Agent; message?: string }>("/admin/agents", {
          method: "POST",
          body: JSON.stringify(body)
        }, token),
  deleteAgent: (token: string, id: string) => request<{ message?: string }>(`/admin/agents/${id}`, { method: "DELETE" }, token),
  runAgent: (token: string, id: string) => request<{ imported: number; message?: string }>(`/admin/agents/${id}/run`, { method: "POST" }, token),
  ads: (token: string) => request<{ ads: AdCampaign[] }>("/admin/ads", {}, token),
  saveAd: (token: string, body: Partial<AdCampaign>) =>
    body._id
      ? request<{ ad: AdCampaign; message?: string }>(`/admin/ads/${body._id}`, {
          method: "PATCH",
          body: JSON.stringify(body)
        }, token)
      : request<{ ad: AdCampaign; message?: string }>("/admin/ads", {
          method: "POST",
          body: JSON.stringify(body)
        }, token),
  deleteAd: (token: string, id: string) => request<{ message?: string }>(`/admin/ads/${id}`, { method: "DELETE" }, token),
  analytics: (token: string) => request<{ analytics: AnalyticsRow[] }>("/admin/analytics", {}, token),
  trackView: (token: string, adId: string, articleId?: string) =>
    request<{ tracked: boolean }>("/tracking/view", {
      method: "POST",
      body: JSON.stringify({ adId, articleId })
    }, token),
  trackClick: (token: string, adId: string, articleId?: string) =>
    request<{ tracked: boolean }>("/tracking/click", {
      method: "POST",
      body: JSON.stringify({ adId, articleId })
    }, token)
};
