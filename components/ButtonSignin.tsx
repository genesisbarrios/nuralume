import Link from "next/link";

export default function ButtonSignin({
  text = "Get started",
}: {
  text?: string;
}) {
  return (
    <Link href="/login" className="btn btn-primary btn-sm">
      {text}
    </Link>
  );
}
