import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/Logo";
import { adminLogin } from "@/lib/actions/auth";

export const metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo compact />
        <h1 className="mt-4 text-2xl font-bold">Admin panel</h1>
        <p className="mt-1 text-sm text-muted">Manage products, prices, and orders</p>
      </div>
      <AuthForm
        title="Sign in"
        subtitle="Admin credentials only."
        fields={[
          { name: "email", label: "Email", type: "email", placeholder: "Enter admin email" },
          { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
        ]}
        submitLabel="Enter admin"
        action={adminLogin}
        altText="Back to store?"
        altHref="/"
        altLinkLabel="View marketplace"
      />
    </div>
  );
}
