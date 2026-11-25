import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import { syncProfileEmail } from "@/libs/profileEmail";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (data.user) {
        const { data: row } = await supabase.from("profiles").select("email").eq("id", data.user.id).maybeSingle();
        await syncProfileEmail(supabase, data.user, row?.email ?? null);
      }
      return NextResponse.redirect(`${origin}${config.auth.callbackUrl}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
