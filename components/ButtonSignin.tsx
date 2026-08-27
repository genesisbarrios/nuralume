import Link from "next/link";

export default function ButtonSignin({
  text = "Get started",
}: {
  text?: string;
}) {
  return (
    <Link href="/login" className="btn btn-sm border-none bg-white text-primary hover:bg-white/90">
      {text}
    </Link>
  );
}
