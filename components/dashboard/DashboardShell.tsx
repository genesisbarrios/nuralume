import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { DesktopNav, MobileNav } from "./BottomNav";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-notebook-cover">
      <div className="mx-auto flex max-w-lg items-center justify-between px-5 pt-6 lg:max-w-4xl lg:pl-24">
        <Link href="/dashboard/home" className="flex items-center text-white">
          <Image
            src="/nuralume-icon.png"
            alt={config.appName}
            width={800}
            height={800}
            className="h-8 w-auto"
          />
          {config.appName}
        </Link>
        <span className="text-xs text-white/60">{config.tagline}</span>
      </div>

      <div className="mx-auto mt-6 flex max-w-lg justify-center lg:max-w-4xl lg:items-stretch">
        <DesktopNav />
        <div className="min-h-[calc(100vh-5rem)] flex-1 rounded-t-[2rem] bg-base-100 bg-ruled-paper pb-28 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] lg:pb-10">
          <div className="mx-auto max-w-lg px-5 pt-8 lg:max-w-2xl">
            {children}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
