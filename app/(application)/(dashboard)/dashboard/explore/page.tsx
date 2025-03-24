"use client";
import { useState } from "react";
import { KryptCard } from "@/app/_components/cards/kryptCard";
import Loader from "@/app/_components/loaders/loader";
import { useKrypts } from "@/app/_hooks/user/krypt/useKrypts";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

function Explore() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);

  const { krypts, kryptsLoading, pagination } = useKrypts(page, activeSearch);

  const handleSearch = () => {
    setActiveSearch(searchInput);
    setPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  if (kryptsLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen bg-[#2E3238] px-4 py-6">
      {/* Simple Search Bar */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search krypts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-3 pl-10 bg-[#1E2024] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}

          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#B2F17E] text-black p-1 rounded-md"
          >
            Go
          </button>
        </div>

        {activeSearch && (
          <p className="mt-2 text-gray-400 text-sm">
            Showing results for `${activeSearch}`
            <button
              onClick={clearSearch}
              className="ml-2 text-blue-400 hover:underline"
            >
              Clear
            </button>
          </p>
        )}
      </div>

      {/* Krypts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {krypts.length > 0 ? (
          krypts.map((krypt, i) => (
            <KryptCard key={i} id={krypt._id || krypt.id} {...krypt} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            No krypts found {activeSearch && `for "${activeSearch}"`}
          </div>
        )}
      </motion.div>

      {/* Simple Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className={`px-4 py-2 bg-[#1E2024] rounded-md ${
              page <= 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-white hover:bg-[#292C35]"
            }`}
          >
            Previous
          </button>

          <span className="text-white">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page >= pagination.totalPages}
            className={`px-4 py-2 bg-[#1E2024] rounded-md ${
              page >= pagination.totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-white hover:bg-[#292C35]"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default authUserWrapper(Explore);
