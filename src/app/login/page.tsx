import { AuthForm } from "@/components/AuthForm";
import { SITE_NAME } from "@/lib/brand";
import { login } from "@/lib/actions/auth";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="relative min-h-[70vh]">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/images/hero/space.svg)" }}
      />
      <div className="relative">
    <AuthForm
      title="Welcome back"
      subtitle={`Log in to your ${SITE_NAME} account.`}
      fields={[
        { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      ]}
      submitLabel="Log in"
      action={login}
      altText={`New to ${SITE_NAME}?`}
      altHref={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
      altLinkLabel="Create an account"
      redirectTo={redirectTo}
    />
      </div>
    </div>
  );
}
