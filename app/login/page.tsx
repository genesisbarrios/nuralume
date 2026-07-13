import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(config.auth.callbackUrl);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <LoginForm />
    </main>
  );
}
