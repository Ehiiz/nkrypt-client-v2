import { useSearchProfile } from "@/app/_hooks/user/profile/useProfileForKrypt";
import React, { useState, useEffect, useRef } from "react";
import { X, Search, User } from "lucide-react"; // Using lucide-react for consistency
import Image from "next/image";

// Type definitions
interface TaggedUser {
  id: string;
  username: string;
  profileImage: string;
}

// Hook for managing tags
export const useUserTags = () => {
  const [tags, setTags] = useState<TaggedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const {
    serachProfile: searchResults,
    searchLoading,
    error,
  } = useSearchProfile({
    query: searchQuery,
  });

  // Add a user to tags
  const addTag = (user: TaggedUser) => {
    // Only add if not already in the list
    if (!tags.some((tag) => tag.id === user.id)) {
      setTags((prev) => [...prev, user]);
    }
    setShowResults(false);
    setSearchQuery("");
  };

  // Remove a tag by id
  const removeTag = (userId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== userId));
  };

  // Clear all tags
  const clearTags = () => {
    setTags([]);
  };

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return {
    tags,
    setTags,
    searchQuery,
    handleSearchChange,
    searchResults,
    searchLoading,
    error,
    addTag,
    removeTag,
    clearTags,
    showResults,
    setShowResults,
  };
};

// User tag input component
export const UserTagInput: React.FC<{
  label?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (tagIds: string[]) => void;
  initialTags?: TaggedUser[];
  className?: string;
}> = ({
  label = "Tag Users",
  placeholder = "Search username...",
  required = false,
  onChange,
  initialTags = [],
  className = "",
}) => {
  const {
    tags,
    setTags,
    searchQuery,
    handleSearchChange,
    searchResults,
    searchLoading,
    showResults,
    setShowResults,
    addTag,
    removeTag,
  } = useUserTags();

  const searchRef = useRef<HTMLDivElement>(null);

  // Set initial tags if provided
  useEffect(() => {
    if (
      initialTags.length > 0 &&
      JSON.stringify(tags) !== JSON.stringify(initialTags)
    ) {
      setTags(initialTags);
    }
  }, [initialTags, tags, setTags]); // Added tags, setTags to dependency array

  // Notify parent component when tags change
  useEffect(() => {
    if (onChange) {
      onChange(tags.map((tag) => tag.id));
    }
  }, [tags, onChange]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowResults]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Tags display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center bg-slate-700/60 text-white px-3 py-1 rounded-full border border-slate-600 shadow-sm"
          >
            {tag.profileImage ? (
              <Image
                height={20} // Adjusted size for consistency
                width={20} // Adjusted size for consistency
                src={tag.profileImage}
                alt={tag.username}
                className="w-5 h-5 rounded-full mr-2 object-cover"
              />
            ) : (
              <User className="w-4 h-4 mr-2 text-slate-400" />
            )}
            <span className="text-sm">{tag.username}</span>
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} /> {/* Using Lucide icon */}
            </button>
          </div>
        ))}
      </div>

      {/* Search input */}
      <div className="relative" ref={searchRef}>
        <div className="flex items-center relative">
          <Search className="absolute left-3 text-slate-400" size={18} />{" "}
          {/* Using Lucide icon, adjusted size */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors" // Updated styling
            onFocus={() => searchQuery.length > 0 && setShowResults(true)}
          />
        </div>

        {/* Search results dropdown */}
        {showResults && (
          <div className="absolute z-10 mt-1 w-full bg-slate-800/80 border border-slate-700/50 rounded-lg shadow-xl max-h-60 overflow-auto">
            {" "}
            {/* Updated styling */}
            {searchLoading ? (
              <div className="p-3 text-center text-slate-400">Loading...</div>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-3 hover:bg-slate-700/60 cursor-pointer flex items-center text-white transition-colors" // Updated styling
                  onClick={() => addTag(user)}
                >
                  {user.profileImage ? (
                    <Image
                      height={24} // Adjusted size
                      width={24} // Adjusted size
                      src={user.profileImage}
                      alt={user.username}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 mr-2 text-slate-400" />
                  )}
                  <span>{user.username}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-slate-400">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
