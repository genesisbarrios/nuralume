import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import ButtonAccount from "@/components/ButtonAccount";
import Footer from "@/components/Footer";
import { DesktopNav, MobileNav } from "./BottomNav";

export default function DashboardShell({
  children,
  userEmail,
  displayName,
}: {
  children: React.ReactNode;
  userEmail: string | null;
  displayName: string | null;
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
        <ButtonAccount
          email={userEmail}
          displayName={displayName}
          showDashboardLink={false}
          className="text-white hover:bg-white/10"
        />
      </div>

      <div className="mx-auto mb-24 mt-6 flex max-w-lg justify-center lg:max-w-4xl lg:items-stretch">
        <DesktopNav />
        <div className="min-h-[calc(100vh-5rem)] flex-1 rounded-[2rem] bg-base-100 bg-ruled-paper pb-20 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
          <div className="mx-auto max-w-lg px-5 pt-8 lg:max-w-2xl">
            {children}
          </div>
        </div>
      </div>

      <Footer />
      {/* Clears the fixed MobileNav so it doesn't cover the footer on mobile. */}
      <div className="h-24 lg:hidden" aria-hidden="true" />

      <MobileNav />
    </div>
  );
}
