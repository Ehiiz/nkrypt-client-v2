import { useSearchProfile } from "@/app/_hooks/user/profile/useProfileForKrypt";
import React, { useState, useEffect, useRef } from "react";
import { FiX, FiSearch, FiUser } from "react-icons/fi";
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
  }, [initialTags]);

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
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Tags display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center bg-[#333339] text-white px-3 py-1 rounded-full"
          >
            {tag.profileImage ? (
              <Image
                height={100}
                width={100}
                src={tag.profileImage}
                alt={tag.username}
                className="w-5 h-5 rounded-full mr-2"
              />
            ) : (
              <FiUser className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm">{tag.username}</span>
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-2 text-gray-400 hover:text-white"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Search input */}
      <div className="relative" ref={searchRef}>
        <div className="flex items-center relative">
          <FiSearch className="absolute left-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#333339] border border-gray-700 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
            onFocus={() => searchQuery.length > 0 && setShowResults(true)}
          />
        </div>

        {/* Search results dropdown */}
        {showResults && (
          <div className="absolute z-10 mt-1 w-full bg-[#2A2A30] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchLoading ? (
              <div className="p-3 text-center text-gray-400">Loading...</div>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-[#333339] cursor-pointer flex items-center"
                  onClick={() => addTag(user)}
                >
                  {user.profileImage ? (
                    <Image
                      height={100}
                      width={100}
                      src={user.profileImage}
                      alt={user.username}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  ) : (
                    <FiUser className="w-5 h-5 mr-2 text-gray-400" />
                  )}
                  <span>{user.username}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-400">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
