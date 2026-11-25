import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
      // A page they were headed to before signing in (e.g. a brain wave from the
      // homepage brain); only same-site dashboard paths are allowed.
      const jar = cookies();
      const raw = jar.get("nl_next")?.value;
      let next = config.auth.callbackUrl;
      try {
        const n = raw ? decodeURIComponent(raw) : "";
        if (n.startsWith("/dashboard") && !n.startsWith("//")) next = n;
      } catch {}
      const res = NextResponse.redirect(`${origin}${next}`);
      if (raw) res.cookies.set("nl_next", "", { path: "/", maxAge: 0 });
      return res;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
