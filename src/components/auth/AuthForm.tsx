import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Role } from "../../types";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
  loading: boolean;
  registerRoles: Role[];
  loginRoles: Role[];
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (payload: {
    name?: string;
    email: string;
    password: string;
    role?: Role;
  }) => Promise<void>;
};

const roleLabel: Record<Role, string> = {
  admin: "Admin",
  user: "Reader",
};

export const AuthForm = ({
  mode,
  loading,
  registerRoles,
  loginRoles,
  onModeChange,
  onSubmit,
}: AuthFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<Role>(
    registerRoles.includes("admin") ? "admin" : "user",
  );
  const [loginRole, setLoginRole] = useState<Role>("admin");

  useEffect(() => {
    setRegisterRole(registerRoles.includes("admin") ? "admin" : "user");
  }, [registerRoles.join("|")]);

  useEffect(() => {
    if (!loginRoles.includes(loginRole)) {
      setLoginRole(loginRoles[0] ?? "user");
    }
  }, [loginRole, loginRoles]);

  const heading = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Welcome back",
            button: "Sign in",
            switchLabel: "Create account",
          }
        : {
            title: "Create your NewsBite account",
            button: "Register",
            switchLabel: "Have an account?",
          },
    [mode],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      name: mode === "register" ? name : undefined,
      email,
      password,
      role: mode === "register" ? registerRole : loginRole,
    });
  };

  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8">
      <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`flex-1 rounded-full px-4 py-2 ${mode === "login" ? "bg-ink text-white" : "text-slate-500"}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onModeChange("register")}
          className={`flex-1 rounded-full px-4 py-2 ${mode === "register" ? "bg-ink text-white" : "text-slate-500"}`}
        >
          Register
        </button>
      </div>

      <div className="mb-6 space-y-2">
        <h2 className="text-3xl font-semibold">{heading.title}</h2>
        <p className="text-sm text-slate-500">
          Register can create only one admin account in total. After that, new
          signups are restricted to readers.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label className="block space-y-2 text-sm font-medium text-slate-600">
            Full name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-accent"
              placeholder="Aarav Sharma"
              required
            />
          </label>
        ) : null}

        <label className="block space-y-2 text-sm font-medium text-slate-600">
          {mode === "login" ? "Login as" : "Register as"}
          <select
            value={mode === "login" ? loginRole : registerRole}
            onChange={(event) =>
              mode === "login"
                ? setLoginRole(event.target.value as Role)
                : setRegisterRole(event.target.value as Role)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-accent"
          >
            {(mode === "login" ? loginRoles : registerRoles).map((role) => (
              <option key={role} value={role}>
                {roleLabel[role]}
              </option>
            ))}
          </select>
        </label>

        {mode === "register" && !registerRoles.includes("admin") ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            An admin account already exists, so new registrations are
            reader-only.
          </p>
        ) : null}

        <label className="block space-y-2 text-sm font-medium text-slate-600">
          Email address
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-accent"
            placeholder="you@example.com"
            type="email"
            required
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-600">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-accent"
            placeholder="Minimum 8 characters"
            type="password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Working..." : heading.button}
        </button>
      </form>

      <button
        type="button"
        onClick={() => onModeChange(mode === "login" ? "register" : "login")}
        className="mt-5 text-sm font-medium text-accent"
      >
        {heading.switchLabel}
      </button>
    </div>
  );
};
