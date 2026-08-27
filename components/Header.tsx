"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";
import ButtonSignin from "./ButtonSignin";
import ButtonAccount from "./ButtonAccount";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/games", label: "Grounding Games" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-primary backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/nuralume-icon.png"
            alt=""
            width={400}
            height={334}
            className="h-9 w-auto"
            priority
          />
          <Image
            src="/Nuralume_title.png"
            alt={config.appName}
            width={1290}
            height={253}
            className="h-5 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          {user ? (
            <ButtonAccount email={user.email ?? null} className="text-white hover:bg-white/10" />
          ) : (
            <ButtonSignin />
          )}
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-sm text-white hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/85 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <ButtonAccount email={user.email ?? null} className="text-white hover:bg-white/10" />
            ) : (
              <ButtonSignin />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
