import { AuthForm } from "@/components/AuthForm";
import { SITE_NAME } from "@/lib/brand";
import { register } from "@/lib/actions/auth";

export const metadata = { title: "Create account" };

export default async function RegisterPage({
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
      title="Create your account"
      subtitle={`Join ${SITE_NAME} to buy and sell with other players.`}
      fields={[
        { name: "username", label: "Username", type: "text", placeholder: "YourGamerTag" },
        { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
        { name: "password", label: "Password (min 8 characters)", type: "password", placeholder: "••••••••" },
      ]}
      submitLabel="Sign up"
      action={register}
      altText="Already have an account?"
      altHref={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
      altLinkLabel="Log in"
      redirectTo={redirectTo}
    />
      </div>
    </div>
  );
}
