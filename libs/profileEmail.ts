import type { SupabaseClient, User } from "@supabase/supabase-js";

// Make sure the signed-in user's email is saved on their profile row.
// The on-signup database trigger is supposed to do this, but it has silently
// failed before (see supabase/migrations/0009), so the app backs it up:
// called after every sign-in and on every dashboard load. Uses the user's own
// session (RLS: insert/update own row only), and only writes when the saved
// email is missing or out of date.
export async function syncProfileEmail(supabase: SupabaseClient<any, any, any>, user: User, savedEmail?: string | null) {
  if (!user.email) return;
  if (savedEmail === user.email) return;
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email }, { onConflict: "id" });
  if (error) console.error("[syncProfileEmail] failed:", error);
}
