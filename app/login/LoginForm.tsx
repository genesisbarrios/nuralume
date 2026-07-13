"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setIsSent(true);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Image
          src="/nuralume-icon.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <h1 className="text-xl font-bold">Sign in to {config.appName}</h1>
        <p className="text-sm text-base-content/60">{config.tagline}</p>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="btn btn-outline w-full"
      >
        Continue with Google
      </button>

      <div className="divider text-xs text-base-content/50">or</div>

      {isSent ? (
        <p className="rounded-lg bg-success/10 p-4 text-center text-sm text-success">
          Check {email} for a magic sign-in link.
        </p>
      ) : (
        <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
          <label className="input input-bordered flex items-center gap-2">
            <Mail className="h-4 w-4 text-base-content/40" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send magic link"}
          </button>
        </form>
      )}
    </div>
  );
}
