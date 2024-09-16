import Link from "next/link";

export default function () {
  return (
    <Link href="/" className="flex items-center gap-x-2 font-semibold">
      <img src="/logo.png" className="w-10 h-10 bg-white rounded-lg" />
      <span className="hidden md:block text-2xl font-medium">Melodisco</span>
    </Link>
  );
}
