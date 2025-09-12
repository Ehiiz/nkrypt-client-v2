// explore/page.tsx
"use client";
import { useState } from "react";
import { KryptCard } from "@/app/_components/cards/kryptCard";
import Loader from "@/app/_components/loaders/loader";
import { useKrypts } from "@/app/_hooks/user/krypt/useKrypts";
import { motion } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative flex items-center bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full shadow-lg transition-all duration-300 focus-within:border-purple-500 hover:shadow-purple-500/10">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search krypts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder:text-slate-500 rounded-full focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 p-2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transition-all hover:scale-105"
            >
              Go
            </button>
          </div>

          {activeSearch && (
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                Showing results for &apos;
                <span className="text-white font-semibold">{activeSearch}</span>
                &apos;
                <button
                  onClick={clearSearch}
                  className="ml-2 text-purple-400 hover:underline"
                >
                  Clear search
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Krypts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {krypts.length > 0 ? (
            krypts.map((krypt, i) => (
              <KryptCard key={i} id={krypt._id || krypt.id} {...krypt} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl font-semibold text-slate-300">
                No krypts found
              </p>
              <p className="text-slate-400 mt-2">
                {activeSearch && `for "${activeSearch}"`}
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2 sm:space-x-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                page <= 1
                  ? "text-slate-600 cursor-not-allowed"
                  : "bg-slate-700/60 text-white hover:bg-slate-600"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="text-slate-300 font-medium text-sm sm:text-base">
              Page {page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page >= pagination.totalPages}
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                page >= pagination.totalPages
                  ? "text-slate-600 cursor-not-allowed"
                  : "bg-slate-700/60 text-white hover:bg-slate-600"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
