import Link from "next/link";
import Image from "next/image";
import config from "@/config";

export default function Footer() {
  return (
    <footer className="border-t border-base-200 bg-base-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Image
                src="/nuralume-logo.png"
                alt=""
                width={603}
                height={722}
                className="h-9 w-auto"
              />
              {config.appName}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-base-content/70">
              {config.appDescription}
            </p>
          </div>

          <div>
            <p className="footer-title mb-2 text-sm font-semibold">Links</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="link link-hover">Features</Link></li>
              <li><Link href="/blog" className="link link-hover">Blog</Link></li>
              <li><Link href="/#pricing" className="link link-hover">Pricing</Link></li>
              <li><Link href="/login" className="link link-hover">Sign in</Link></li>
              <li>
                <a
                  href="https://instagram.com/nuralumewellness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@nuralumewellness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-title mb-2 text-sm font-semibold">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tos" className="link link-hover">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="link link-hover">Privacy Policy</Link></li>
              <li>
                <a href={`mailto:${config.resend.supportEmail}`} className="link link-hover">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-base-300 pt-6 text-xs text-base-content/60">
          &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
