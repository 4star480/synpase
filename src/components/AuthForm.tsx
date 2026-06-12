"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthState } from "@/lib/actions/auth";

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
};

export function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  action,
  altText,
  altHref,
  altLinkLabel,
  redirectTo,
}: {
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel: string;
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  altText: string;
  altHref: string;
  altLinkLabel: string;
  redirectTo?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="mx-auto mt-12 w-full max-w-md px-4">
      <div className="rounded-xl border border-border-dim bg-surface p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>

        <form action={formAction} className="mt-6 space-y-4">
          {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1.5 block text-sm font-medium">{f.label}</span>
              <input
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                required
                className="w-full rounded-lg border border-border-dim bg-background px-3 py-2.5 text-base outline-none placeholder:text-muted focus:border-accent sm:text-sm"
              />
            </label>
          ))}

          {state.error && (
            <p className="rounded-lg bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent py-2.5 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Please wait..." : submitLabel}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {altText}{" "}
          <Link href={altHref} className="font-medium text-accent hover:underline">
            {altLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
