/* eslint-disable @typescript-eslint/no-unused-vars */
// app/_components/UnsplashSearch.tsx
"use client";
import { UnsplashImage } from "@/app/_utils/interfaces/util.interface";
import { Search, Loader2, CheckCircle, Image, X } from "lucide-react";
import NextImage from "next/image";
import { Dispatch, SetStateAction } from "react";

export function UnsplashSearch({
  unsplashSearchQuery,
  setUnsplashSearchQuery,
  searchUnsplashImages,
  isSearchingUnsplash,
  unsplashResults,
  handleUnsplashImageSelect,
  setShowUnsplashResults,
}: {
  unsplashSearchQuery: string;
  setUnsplashSearchQuery: Dispatch<SetStateAction<string>>;
  searchUnsplashImages: (query: string) => Promise<void>;
  isSearchingUnsplash: boolean;
  unsplashResults: UnsplashImage[];
  handleUnsplashImageSelect: (image: UnsplashImage) => void;
  setShowUnsplashResults: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="mb-4 p-4 sm:p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-inner">
      <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 mb-4">
        <input
          type="text"
          value={unsplashSearchQuery}
          onChange={(e) => setUnsplashSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              searchUnsplashImages(unsplashSearchQuery);
            }
          }}
          className="flex-1 min-w-0 bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          placeholder="Search Unsplash images..."
        />
        <button
          type="button"
          onClick={() => searchUnsplashImages(unsplashSearchQuery)}
          disabled={!unsplashSearchQuery.trim() || isSearchingUnsplash}
          className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-all shadow-md
            ${
              unsplashSearchQuery.trim() && !isSearchingUnsplash
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
        >
          {isSearchingUnsplash ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Search className="mr-2" />
              Search
            </>
          )}
        </button>
      </div>

      {unsplashResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2">
          {unsplashResults.map((image: UnsplashImage) => (
            <div
              key={image.id}
              onClick={() => handleUnsplashImageSelect(image)}
              className="relative group cursor-pointer rounded-lg overflow-hidden aspect-square hover:scale-105 transition-transform border-2 border-transparent hover:border-purple-500 shadow-md"
            >
              <NextImage
                src={image.urls.regular}
                alt={image.alt_description || "Unsplash image"}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <CheckCircle className="text-white" size={36} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  By {image.user.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {unsplashResults.length === 0 &&
        unsplashSearchQuery &&
        !isSearchingUnsplash && (
          <div className="text-center text-slate-400 py-8">
            <Image size={48} className="mx-auto mb-2 opacity-50" />
            <p>
              No images found for “{unsplashSearchQuery}“. Try a different
              search term.
            </p>
          </div>
        )}
      {unsplashResults.length === 0 &&
        !unsplashSearchQuery &&
        !isSearchingUnsplash && (
          <div className="text-center text-slate-400 py-8">
            <Image size={48} className="mx-auto mb-2 opacity-50" />
            <p>Enter a search term above to find images from Unsplash.</p>
          </div>
        )}
    </div>
  );
}
