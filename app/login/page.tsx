import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const next = searchParams?.next;
    redirect(next && next.startsWith("/dashboard") && !next.startsWith("//") ? next : config.auth.callbackUrl);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <LoginForm />
    </main>
  );
}
