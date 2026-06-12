"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";

export type AuthState = { error?: string; email?: string };

function safeRedirect(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Enter a valid email address." };
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
    return { error: "Username must be 3-20 characters (letters, numbers, underscores)." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true },
  });
  if (existing) {
    return { error: existing.email === email ? "Email already registered." : "Username is taken." };
  }

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: await bcrypt.hash(password, 10),
      avatarHue: Math.floor(Math.random() * 360),
    },
  });

  const redirectTo = safeRedirect(String(formData.get("redirect") ?? ""));
  await createSession(user.id, user.role);
  redirect(redirectTo || "/");
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email or password.", email };
  }

  const redirectTo = safeRedirect(String(formData.get("redirect") ?? ""));
  await createSession(user.id, user.role);
  if (user.role === "ADMIN" && (!redirectTo || redirectTo === "/")) {
    redirect("/admin");
  }
  redirect(redirectTo || "/");
}

export async function adminLogin(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "ADMIN" || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid admin credentials.", email };
  }

  await createSession(user.id, user.role);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function adminLogout() {
  await destroySession();
  redirect("/admin/login");
}
