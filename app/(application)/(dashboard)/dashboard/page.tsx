"use client";

import React from "react";
import { useKrypts } from "@/app/_hooks/user/krypt/useKrypts";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import { Hash, Zap, TrendingUp, Search, Filter } from "lucide-react";
import { KryptCard } from "@/app/_components/cards/kryptCard";

function Dashboard() {
  const { krypts, kryptsLoading } = useKrypts();

  if (kryptsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-pink-600/5"></div>
          <div className="relative flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Hash size={20} className="text-white" />
              </div>
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                Discover Krypts
              </div>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-2xl mt-2 sm:mt-0">
              NKRYPT
            </div>
          </div>
        </header>

        {/* Loading State */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 p-4">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animate-reverse animation-delay-150"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              Loading Krypts...
            </h3>
            <p className="text-sm text-slate-400">
              Discovering the latest challenges and puzzles
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tr from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/3 to-pink-400/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-xl sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-pink-600/5"></div>
        <div className="relative">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-b border-slate-700/30 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Hash size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                  Discover Krypts
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Explore challenges and earn rewards
                </p>
              </div>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-2xl mt-4 sm:mt-0">
              NKRYPT
            </div>
          </div>

          {/* Stats bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-800/40 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                    <Hash size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {krypts?.length || 0}
                    </p>
                    <p className="text-xs text-slate-400">Total Krypts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Zap size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Active</p>
                    <p className="text-xs text-slate-400">Status</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <TrendingUp size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Trending</p>
                    <p className="text-xs text-slate-400">Now</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
                <button className="group relative overflow-hidden bg-slate-700/60 hover:bg-slate-600/60 border border-slate-500/30 hover:border-purple-400/50 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 flex-1 sm:flex-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-2 justify-center">
                    <Search
                      size={16}
                      className="text-slate-400 group-hover:text-white transition-colors"
                    />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      Search
                    </span>
                  </div>
                </button>
                <button className="group relative overflow-hidden bg-slate-700/60 hover:bg-slate-600/60 border border-slate-500/30 hover:border-purple-400/50 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 flex-1 sm:flex-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-2 justify-center">
                    <Filter
                      size={16}
                      className="text-slate-400 group-hover:text-white transition-colors"
                    />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      Filter
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {krypts && krypts.length > 0 ? (
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {krypts.map((krypt, i) => (
                <div
                  key={krypt._id || i}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <KryptCard id={krypt._id} {...krypt} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 px-6 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-700 to-slate-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <Hash size={40} className="text-slate-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-300 mb-3">
              No Krypts Available
            </h3>
            <p className="max-w-md text-slate-400 mb-6 text-sm sm:text-base">
              There are no krypts to display at the moment. Check back later for
              new challenges and puzzles!
            </p>
            <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-2">
                <Zap size={18} />
                <span>Create First Krypt</span>
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default authUserWrapper(Dashboard);
