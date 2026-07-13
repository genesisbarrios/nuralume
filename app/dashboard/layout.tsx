import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import { getProfileBirthData } from "@/libs/profile";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(config.auth.loginUrl);
  }

  const profile = await getProfileBirthData();

  return (
    <DashboardShell userEmail={user.email ?? null} displayName={profile?.displayName ?? null}>
      {children}
    </DashboardShell>
  );
}
