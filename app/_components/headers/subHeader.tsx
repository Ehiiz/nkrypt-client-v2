import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubHeader() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#222227]">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-300 hover:text-[#B2F17E]"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>
      <div className="text-[#B2F17E] font-bold text-xl">NKRYPT</div>
    </header>
  );
}
