"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { createClient } from "@/libs/supabase/client";

export default function ButtonAccount({ email }: { email: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        className="btn btn-ghost btn-sm gap-2"
        onClick={() => setIsOpen((v) => !v)}
      >
        <User className="h-4 w-4" />
        <span className="max-w-[140px] truncate">{email}</span>
      </button>
      {isOpen && (
        <ul className="menu dropdown-content z-20 mt-2 w-52 rounded-box bg-base-100 p-2 shadow">
          <li>
            <Link href="/dashboard/home" onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <button type="button" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
