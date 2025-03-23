"use client";
import { KryptCard } from "@/app/_components/cards/kryptCard";
import { useKrypts } from "@/app/_hooks/user/krypt/useKrypts";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";

function Dashboard() {
  const { krypts, kryptsLoading } = useKrypts();

  if (kryptsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#2E3238]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {krypts.map((krypt, i) => (
          <KryptCard key={i} id={krypt._id} {...krypt} />
        ))}
      </div>
    </div>
  );
}

export default authUserWrapper(Dashboard);
