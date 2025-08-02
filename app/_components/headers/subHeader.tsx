// _components/headers/subHeader.tsx
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 sm:px-6 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>
      <Link
        href="/dashboard"
        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
      >
        NKRYPT
      </Link>
    </header>
  );
}
