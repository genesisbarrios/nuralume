"use server";

import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/server";
import type { Database } from "@/types/database";

// Every user-owned table (profiles, reminders, favorites, etc.) references
// auth.users with ON DELETE CASCADE, so deleting the auth user is enough to
// clean up everything else — no manual per-table deletes needed.
export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error("[deleteAccount] SUPABASE_SERVICE_ROLE_KEY is not set");
    return { error: "Account deletion isn't available right now." };
  }

  const admin = createSupabaseAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[deleteAccount] deleteUser failed:", error);
    return { error: "Could not delete your account. Please try again." };
  }

  return {};
}
