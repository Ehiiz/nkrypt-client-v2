/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiYoutube,
  FiImage,
  FiMusic,
  FiLock,
  FiSave,
  FiCheck,
  FiSearch,
} from "react-icons/fi";
import { IoText } from "react-icons/io5";
import { RiLockPasswordLine, RiQuestionAnswerLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { KryptTypeEnum } from "@/app/_hooks/user/krypt/krypt.interface";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { useRouter } from "next/navigation";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import { UserTagInput } from "@/app/_components/cards/userTags";
import Image from "next/image";
import {
  ContentItem,
  KryptData,
  Question,
  UnsplashImage,
  UnsplashSearchResponse,
  YouTubeSong,
} from "@/app/_utils/interfaces/util.interface";
// Type definitions

const CreateKryptForm = () => {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);

  const [kryptData, setKryptData] = useState<KryptData>({
    title: "",
    description: "",
    content: [],
    type: KryptTypeEnum.NO_LOCK,
    draft: true,
    questions: [],
    tags: [], // Initialize empty tags array
    maxWinners: null,
    prizePool: null,
  });

  const [walletValid, setWalletValid] = useState<boolean>(false);

  const [currentContent, setCurrentContent] = useState<ContentItem>({
    type: "text",
    content: "",
  });

  const [unsplashSearchQuery, setUnsplashSearchQuery] = useState<string>("");
  const [unsplashResults, setUnsplashResults] = useState<UnsplashImage[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] =
    useState<boolean>(false);
  const [showUnsplashResults, setShowUnsplashResults] =
    useState<boolean>(false);

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    options: ["", ""],
    answer: "",
    index: 0,
  });

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setKryptData({
      ...kryptData,
      [name]: value,
    });
  };

  // Fixed handleRewardInfoChange function
  const handleRewardInfoChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Convert string value to number, handle empty string as null
    const numericValue = value === "" ? null : parseInt(value, 10);

    // Check balance when prizePool is being set
    if (name === "prizePool" && numericValue && numericValue > 0) {
      try {
        const data = await UserKryptService.checkBalance({
          amount: numericValue,
        });

        if (data.success) {
          setWalletValid(data.data!.valid);
        } else {
          setWalletValid(false);
        }
      } catch (error) {
        console.error("Error checking balance:", error);
        setWalletValid(false);
      }
    } else if (name === "prizePool") {
      setWalletValid(true); // Reset validation if no prize pool
    }

    setKryptData({
      ...kryptData,
      [name]: numericValue,
    });
  };

  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState<string>("");
  const [youtubeSearchResults, setYoutubeSearchResults] = useState<
    YouTubeSong[]
  >([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [backgroundMusic, setBackgroundMusic] = useState<YouTubeSong | null>(
    null
  );

  const searchUnsplashImages = async (query: string): Promise<void> => {
    if (!query.trim()) return;

    setIsSearchingUnsplash(true);
    try {
      // Using Unsplash's public API endpoint with error handling
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=12&client_id=mGV-9Jych6qEGaBGcvj7F_5wnVc8NHuswNSWmFyDcCA`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data: UnsplashSearchResponse = await response.json();
        console.log("Unsplash API Response:", data); // Debug log
        setUnsplashResults(data.results || []);
        setShowUnsplashResults(true);

        if (!data.results || data.results.length === 0) {
          console.log("No results found for query:", query);
        }
      } else {
        console.error(
          "Failed to fetch Unsplash images. Status:",
          response.status
        );
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setUnsplashResults([]);

        // Show user-friendly error message
        alert(`Failed to search images. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error searching Unsplash:", error);
      setUnsplashResults([]);
      alert("Network error occurred while searching images. Please try again.");
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  const handleUnsplashImageSelect = (image: UnsplashImage): void => {
    console.log("Selected image:", image); // Debug log
    handleContentValueChange(image.urls.regular);
    setShowUnsplashResults(false);
    setUnsplashSearchQuery("");
    setUnsplashResults([]);
  };

  const hasImageError = (url: string): boolean => {
    return false;
  };

  const handleImageError = (url: string): void => {
    console.error(`Failed to load image: ${url}`);
  };

  const searchYouTubeMusic = async (query: string): Promise<void> => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const API_KEY = "AIzaSyATw_J0rBSzyJeIh77skZ7GEwJpfixQURc";
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
          query
        )}&type=video&videoCategoryId=10&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube data");
      }

      const data = await response.json();

      const videoIds = data.items.map((item: any) => item.id.videoId).join(",");
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
      );

      const detailsData = await detailsResponse.json();

      const results: YouTubeSong[] = detailsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default.url,
        duration: formatDuration(item.contentDetails.duration),
        url: `https://music.youtube.com/watch?v=${item.id}`,
      }));

      setYoutubeSearchResults(results);
    } catch (error) {
      console.error("YouTube search error:", error);
      setYoutubeSearchResults([]);
      const mockResults: YouTubeSong[] = [
        {
          id: "1",
          title: `Results for "${query}"`,
          artist: "Sample Artist",
          thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg",
          duration: "3:53",
          url: "https://music.youtube.com/watch?v=JGwWNGJdvx8",
        },
      ];
      setYoutubeSearchResults(mockResults);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";

    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");

    if (hours) {
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }
    return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
  };

  //Background Music Selection
  const handleBackgroundMusicSelect = (song: YouTubeSong): void => {
    setBackgroundMusic(song);
    setKryptData({
      ...kryptData,
      backgroundMusic: song.url,
    });
    setYoutubeSearchResults([]);
    setYoutubeSearchQuery("");
  };

  // Background Music Remocal
  const removeBackgroundMusic = (): void => {
    setBackgroundMusic(null);
  };
  // Handle tag changes from UserTagInput
  const handleTagsChange = useCallback((tags: string[]) => {
    setKryptData((prev) => ({
      ...prev,
      tags,
    }));
  }, []);

  // Handle content type change
  const handleContentTypeChange: any = (type: "text" | "image" | "sound") => {
    setCurrentContent({
      ...currentContent,
      type,
    });
  };

  // Handle content value change
  const handleContentValueChange = (value: string) => {
    setCurrentContent({
      ...currentContent,
      content: value,
    });
  };

  // Add content item to krypt
  const addContentItem = () => {
    if (currentContent.content.trim()) {
      setKryptData({
        ...kryptData,
        content: [...kryptData.content, { ...currentContent }],
      });
      setCurrentContent({
        type: "text",
        content: "",
      });
    }
  };

  // Remove content item
  const removeContentItem = (index: number) => {
    const newContent = [...kryptData.content];
    newContent.splice(index, 1);
    setKryptData({
      ...kryptData,
      content: newContent,
    });
  };

  // Handle lock type change
  const handleLockTypeChange = (type: KryptTypeEnum) => {
    // Reset questions if changing to no lock
    if (type === "no lock") {
      setKryptData({
        ...kryptData,
        type,
        questions: [],
      });
    } else {
      setKryptData({
        ...kryptData,
        type,
      });
    }
  };

  // Handle question changes
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
    });
  };

  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  // Add option to question (max 3)
  const addOption = () => {
    if (currentQuestion.options.length < 3) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  };

  // Remove option from question (minimum 2)
  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = [...currentQuestion.options];
      newOptions.splice(index, 1);
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      });
    }
  };

  // Add question to krypt
  const addQuestion = () => {
    // For passcode, we only need the answer (the passcode value)
    if (kryptData.type === "passcode") {
      if (currentQuestion.answer.trim()) {
        // For passcode, create a simplified question object
        const passcodeQuestion = {
          question: "Enter passcode:", // Using a placeholder question
          options: [],
          answer: currentQuestion.answer.trim(),
          index: 1,
        };

        // Replace any existing questions for passcode type
        setKryptData({
          ...kryptData,
          questions: [passcodeQuestion],
        });

        // Reset form
        setCurrentQuestion({
          question: "",
          options: ["", ""],
          answer: "",
          index: 0,
        });
      }
    }
    // For quiz and multiple choice
    else if (currentQuestion.question.trim() && currentQuestion.answer.trim()) {
      const newQuestion = {
        ...currentQuestion,
        index: kryptData.questions.length + 1,
      };

      setKryptData({
        ...kryptData,
        questions: [...kryptData.questions, newQuestion],
      });

      // Reset form
      setCurrentQuestion({
        question: "",
        options: ["", ""],
        answer: "",
        index: 0,
      });
    }
  };

  // Remove question
  const removeQuestion = (index: number) => {
    const newQuestions = [...kryptData.questions];
    newQuestions.splice(index, 1);

    // Update indexes for remaining questions
    const updatedQuestions = newQuestions.map((q, i) => ({
      ...q,
      index: i + 1,
    }));

    setKryptData({
      ...kryptData,
      questions: updatedQuestions,
    });
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a deep copy of kryptData to avoid modifying the original state
    const submissionData = JSON.parse(JSON.stringify(kryptData));

    // Handle questions based on krypt type
    if (submissionData.type === KryptTypeEnum.NO_LOCK) {
      // For no lock type, remove questions completely
      delete submissionData.questions;
    } else if (submissionData.type === KryptTypeEnum.PASSCODE) {
      // For passcode, keep only the answer field in questions
      submissionData.questions = submissionData.questions.map(
        (q: { answer: any; index: any }) => ({
          answer: q.answer,
          index: q.index,
        })
      );
    } else if (submissionData.type === KryptTypeEnum.QUIZ) {
      // For quiz, remove options from questions
      submissionData.questions = submissionData.questions.map(
        (q: { question: any; answer: any; index: any }) => ({
          question: q.question,
          answer: q.answer,
          index: q.index,
        })
      );
    }
    // For multiple choice, keep all fields (no changes needed)

    console.log("Submitting Krypt:", submissionData);
    console.log(submissionData.content);
    console.log("Tagged Users:", submissionData.tagIds);

    const data = await UserKryptService.createKrypt(submissionData);
    console.log(data);

    if (data.success) {
      toastAlert({
        type: ToastType.success,
        message: "Krypt created successfully!",
      });
      router.push(`/dashboard`);
    } else {
      toastAlert({
        type: ToastType.error,
        message: "Failed to create Krypt. Please try again.",
      });
    }
  };

  // Determine if user can proceed to next step
  const canProceedToStep2 =
    kryptData.title.trim() !== "" && kryptData.description.trim() !== "";
  const canProceedToStep3 = kryptData.content.length > 0;
  const canSubmitForm =
    kryptData.type === "no lock" ||
    (kryptData.type === "passcode" &&
      kryptData.questions.length === 1 &&
      kryptData.questions[0].answer) ||
    ((kryptData.type === "quiz" ||
      kryptData.type === KryptTypeEnum.MULTPLE_CHOICE) &&
      kryptData.questions.length > 0);

  const renderStepOne = () => (
    <div className="transition-all">
      <h2 className="text-2xl font-bold mb-6 text-[#B2F17E]">
        Basic Information
      </h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={kryptData.title}
          onChange={handleBasicInfoChange}
          className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
          placeholder="Enter krypt title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={kryptData.description}
          onChange={handleBasicInfoChange}
          rows={4}
          className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
          placeholder="Enter krypt description"
        />
      </div>

      {/* User Tag Input Component */}
      <div className="mb-6">
        <UserTagInput
          label="Tag Users (Optional)"
          placeholder="Search for users to tag..."
          required={false}
          onChange={handleTagsChange}
          className="mb-4"
        />
      </div>

      <div className="flex justify-between">
        <div></div>
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={!canProceedToStep2}
          className={`flex items-center px-4 py-2 rounded-md ${
            canProceedToStep2
              ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStepTwo = () => {
    return (
      <div className="transition-all">
        <h2 className="text-2xl font-bold mb-6 text-[#B2F17E]">
          Content & Music
        </h2>

        {/* Content Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-white">Content</h3>

          {/* Content type selection (Text and Image only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Content Type
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => handleContentTypeChange("text")}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  currentContent.type === "text"
                    ? "bg-[#B2F17E] text-[#222227]"
                    : "bg-[#333339] text-white hover:bg-gray-600"
                }`}
              >
                <IoText className="mr-2" />
                Text
              </button>
              <button
                type="button"
                onClick={() => handleContentTypeChange("image")}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  currentContent.type === "image"
                    ? "bg-[#B2F17E] text-[#222227]"
                    : "bg-[#333339] text-white hover:bg-gray-600"
                }`}
              >
                <FiImage className="mr-2" />
                Image
              </button>
            </div>
          </div>

          {/* Content input based on type */}
          <div className="mb-6">
            {currentContent.type === "text" && (
              <div>
                <label
                  htmlFor="text-content"
                  className="block text-sm font-medium mb-1"
                >
                  Text Content
                </label>
                <textarea
                  id="text-content"
                  value={currentContent.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleContentValueChange(e.target.value)
                  }
                  rows={4}
                  className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E] transition-all"
                  placeholder="Enter your text content"
                />
              </div>
            )}

            {currentContent.type === "image" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image Source
                </label>
                <div className="flex space-x-3 mb-3">
                  <button
                    type="button"
                    className="flex items-center px-3 py-2 bg-[#333339] rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <FiUpload className="mr-2" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log(
                        "Toggling Unsplash results. Current state:",
                        showUnsplashResults
                      ); // Debug log
                      setShowUnsplashResults(!showUnsplashResults);
                    }}
                    className="flex items-center px-3 py-2 bg-[#333339] rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <FiImage className="mr-2" />
                    Unsplash
                  </button>
                </div>

                {/* Unsplash Search Interface */}
                {showUnsplashResults && (
                  <div className="mb-4 p-4 bg-[#2a2a2f] border border-gray-600 rounded-md">
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={unsplashSearchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          console.log("Search query updated:", e.target.value); // Debug log
                          setUnsplashSearchQuery(e.target.value);
                        }}
                        onKeyPress={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            console.log(
                              "Enter pressed, searching for:",
                              unsplashSearchQuery
                            ); // Debug log
                            searchUnsplashImages(unsplashSearchQuery);
                          }
                        }}
                        className="flex-1 bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E] transition-all"
                        placeholder="Search Unsplash images..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          console.log(
                            "Search button clicked, query:",
                            unsplashSearchQuery
                          ); // Debug log
                          searchUnsplashImages(unsplashSearchQuery);
                        }}
                        disabled={
                          !unsplashSearchQuery.trim() || isSearchingUnsplash
                        }
                        className={`flex items-center px-4 py-2 rounded-md transition-all ${
                          unsplashSearchQuery.trim() && !isSearchingUnsplash
                            ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isSearchingUnsplash ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiSearch className="mr-2" />
                        )}
                        {isSearchingUnsplash ? "Searching..." : "Search"}
                      </button>
                    </div>

                    {/* Debug information */}
                    <div className="mb-2 text-xs text-gray-400">
                      Debug: Query = &ldquo;{unsplashSearchQuery}&ldquo;,
                      Results count = {unsplashResults.length}, Searching ={" "}
                      {isSearchingUnsplash ? "true" : "false"}
                    </div>

                    {/* Unsplash Search Results */}
                    {unsplashResults.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                        {unsplashResults.map((image: UnsplashImage) => (
                          <div
                            key={image.id}
                            onClick={() => handleUnsplashImageSelect(image)}
                            className="relative group cursor-pointer rounded-md overflow-hidden aspect-square hover:scale-105 transition-transform"
                          >
                            <Image
                              src={image.urls.regular}
                              alt={image.alt_description || "Unsplash image"}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              unoptimized
                              onError={(e) => {
                                console.error(
                                  "Failed to load image:",
                                  image.urls.small
                                );
                              }}
                            />
                            <div className="absolute inset-0 bg-black/[200] bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white bg-opacity-90 rounded-full p-2">
                                  <FiCheck
                                    className="text-green-600"
                                    size={20}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                              <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                By {image.user.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No results message */}
                    {unsplashResults.length === 0 &&
                      unsplashSearchQuery &&
                      !isSearchingUnsplash && (
                        <div className="text-center text-gray-400 py-8">
                          <FiImage
                            size={48}
                            className="mx-auto mb-2 opacity-50"
                          />
                          <p>
                            No images found for &ldquo;{unsplashSearchQuery}
                            &ldquo;. Try a different search term.
                          </p>
                        </div>
                      )}

                    {/* Initial state message */}
                    {unsplashResults.length === 0 &&
                      !unsplashSearchQuery &&
                      !isSearchingUnsplash && (
                        <div className="text-center text-gray-400 py-8">
                          <FiImage
                            size={48}
                            className="mx-auto mb-2 opacity-50"
                          />
                          <p>
                            Enter a search term above to find images from
                            Unsplash
                          </p>
                        </div>
                      )}

                    <div className="mt-4 pt-3 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUnsplashResults(false);
                          setUnsplashSearchQuery("");
                          setUnsplashResults([]);
                        }}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Close Unsplash Search
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="url"
                  value={currentContent.content}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleContentValueChange(e.target.value)
                  }
                  className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E] transition-all"
                  placeholder="https://example.com/image.jpg"
                />

                {/* Image preview - also use regular img tag here */}
                {currentContent.content &&
                  !hasImageError(currentContent.content) && (
                    <div className="mt-3">
                      <div className="relative w-48 h-32 border border-gray-600 rounded-md overflow-hidden">
                        <Image
                          src={currentContent.content}
                          alt="Content preview"
                          fill
                          className="object-cover"
                          onError={() =>
                            handleImageError(currentContent.content)
                          }
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                {/* Image error fallback */}
                {currentContent.content &&
                  hasImageError(currentContent.content) && (
                    <div className="mt-3 w-48 h-32 bg-gray-700 border border-gray-600 rounded-md flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <FiImage size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Failed to load image</p>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Add content button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={addContentItem}
              disabled={!currentContent.content.trim()}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                currentContent.content.trim()
                  ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiPlus className="mr-2" />
              Add Content Item
            </button>
          </div>

          {/* Content list */}
          {kryptData.content.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Added Content</h4>
              <div className="space-y-3">
                {kryptData.content.map((item: ContentItem, index: number) => (
                  <div
                    key={`content-${index}`}
                    className="flex justify-between items-center p-4 bg-[#333339] rounded-md border border-gray-600"
                  >
                    <div className="flex items-center flex-1">
                      {item.type === "text" && (
                        <>
                          <IoText
                            className="mr-3 text-[#B2F17E] flex-shrink-0"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 mb-1">
                              Text Content
                            </p>
                            <p className="truncate max-w-md text-white">
                              {item.content}
                            </p>
                          </div>
                        </>
                      )}

                      {item.type === "image" && (
                        <>
                          <div className="mr-3 flex-shrink-0">
                            {!hasImageError(item.content) ? (
                              <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-600">
                                <Image
                                  src={item.content}
                                  alt="Content preview"
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                  onError={() => handleImageError(item.content)}
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-700 rounded-md border border-gray-600 flex items-center justify-center">
                                <FiImage className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 mb-1">Image</p>
                            <p className="truncate max-w-md text-white text-sm">
                              {item.content}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeContentItem(index)}
                      className="text-red-400 hover:text-red-300 p-2 flex-shrink-0 transition-colors"
                      aria-label={`Remove ${item.type} content`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background Music Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <FiMusic className="mr-2 text-[#B2F17E]" />
            Background Music (Optional)
          </h3>

          {!backgroundMusic ? (
            <div>
              {/* YouTube Music Search */}
              <div className="mb-4">
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={youtubeSearchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setYoutubeSearchQuery(e.target.value)
                    }
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        searchYouTubeMusic(youtubeSearchQuery);
                      }
                    }}
                    className="flex-1 bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E] transition-all"
                    placeholder="Search for background music..."
                  />
                  <button
                    type="button"
                    onClick={() => searchYouTubeMusic(youtubeSearchQuery)}
                    disabled={!youtubeSearchQuery.trim() || isSearching}
                    className={`flex items-center px-4 py-2 rounded-md transition-all ${
                      youtubeSearchQuery.trim() && !isSearching
                        ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiYoutube className="mr-2" />
                    )}
                    {isSearching ? "Searching..." : "Search YouTube"}
                  </button>
                </div>

                {/* Search Results */}
                {youtubeSearchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto bg-[#2a2a2f] rounded-md border border-gray-600">
                    {youtubeSearchResults.map((song: YouTubeSong) => (
                      <div
                        key={song.id}
                        onClick={() => handleBackgroundMusicSelect(song)}
                        className="flex items-center p-3 hover:bg-[#333339] cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(
                          e: React.KeyboardEvent<HTMLDivElement>
                        ) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleBackgroundMusicSelect(song);
                          }
                        }}
                      >
                        <div className="relative w-12 h-12 mr-3 rounded-md overflow-hidden">
                          <Image
                            src={song.thumbnail}
                            alt={`${song.title} thumbnail`}
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{song.title}</p>
                          <p className="text-sm text-gray-300">{song.artist}</p>
                        </div>
                        <span className="text-sm text-gray-400">
                          {song.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Manual URL input */}
              <div className="border-t border-gray-600 pt-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Or enter YouTube Music URL directly
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://music.youtube.com/watch?v=..."
                    className="flex-1 bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E] transition-all"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        const url = e.currentTarget.value;
                        if (url.trim()) {
                          const mockSong: YouTubeSong = {
                            id: "manual",
                            title: "Manual Selection",
                            artist: "Custom URL",
                            thumbnail:
                              "https://img.youtube.com/vi/default/mqdefault.jpg",
                            duration: "Unknown",
                            url: url,
                          };
                          handleBackgroundMusicSelect(mockSong);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Selected Background Music Display */
            <div className="bg-gradient-to-r from-[#2a2a2f] to-[#333339] border border-[#B2F17E] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4 rounded-md overflow-hidden">
                    <Image
                      src={backgroundMusic.thumbnail}
                      alt={`${backgroundMusic.title} thumbnail`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white text-lg">
                      {backgroundMusic.title}
                    </p>
                    <p className="text-gray-300">{backgroundMusic.artist}</p>
                    <p className="text-sm text-gray-400">
                      Duration: {backgroundMusic.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm text-[#B2F17E] font-medium">
                      Background Music Selected
                    </p>
                    <p className="text-xs text-gray-400">
                      This will play during your krypt
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeBackgroundMusic}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                    aria-label="Remove background music"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            disabled={kryptData.content.length === 0}
            className={`flex items-center px-4 py-2 rounded-md transition-all ${
              kryptData.content.length > 0
                ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  };
  // Updated renderStepThree function with validation logic

  const renderStepThree = () => {
    // Calculate minimum winners based on pool size (each winner gets minimum 2 ADA)
    const maxPossibleWinners = kryptData.prizePool
      ? Math.floor(kryptData.prizePool / 2)
      : null;

    // Validation for max winners
    const isMaxWinnersValid =
      !kryptData.prizePool ||
      (kryptData.maxWinners &&
        kryptData.maxWinners >= 1 &&
        kryptData.maxWinners <= maxPossibleWinners!);

    const canProceedToStep4WithRewards =
      kryptData.prizePool === null ||
      (kryptData.prizePool !== null &&
        kryptData.prizePool! >= 0 &&
        walletValid &&
        kryptData.maxWinners !== null &&
        isMaxWinnersValid);

    return (
      <div className="transition-all">
        <h2 className="text-2xl font-bold mb-6 text-[#B2F17E]">
          Reward Information
        </h2>

        <div className="mb-4">
          <label htmlFor="prizePool" className="block text-sm font-medium mb-1">
            ADA Reward
          </label>
          <input
            type="number"
            id="prizePool"
            name="prizePool"
            value={kryptData.prizePool ?? ""}
            onChange={handleRewardInfoChange}
            className={`w-full bg-[#333339] border ${
              !walletValid && kryptData.prizePool
                ? "border-red-500"
                : "border-gray-700"
            } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]`}
            placeholder="Enter ADA reward amount (optional)"
            min="0"
          />
          {!walletValid && kryptData.prizePool && (
            <p className="text-red-400 text-sm mt-1">Insufficient balance</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="maxWinners"
            className="block text-sm font-medium mb-1"
          >
            Max Winners{" "}
            {kryptData.prizePool && <span className="text-red-400">*</span>}
          </label>
          <input
            type="number"
            id="maxWinners"
            name="maxWinners"
            value={kryptData.maxWinners ?? ""}
            onChange={handleRewardInfoChange}
            className={`w-full bg-[#333339] border ${
              kryptData.prizePool &&
              (!kryptData.maxWinners || !isMaxWinnersValid)
                ? "border-red-500"
                : "border-gray-700"
            } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]`}
            placeholder={
              kryptData.prizePool
                ? `Enter max winners (required, max: ${maxPossibleWinners})`
                : "Enter maximum number of winners (optional)"
            }
            min="1"
            max={maxPossibleWinners || undefined}
            disabled={!kryptData.prizePool}
          />

          {/* Validation messages */}
          {kryptData.prizePool && !kryptData.maxWinners && (
            <p className="text-red-400 text-sm mt-1">
              Max winners is required when prize pool is set
            </p>
          )}

          {kryptData.prizePool &&
            kryptData.maxWinners &&
            kryptData.maxWinners > maxPossibleWinners! && (
              <p className="text-red-400 text-sm mt-1">
                Too many winners! Each winner must receive at least 2 ADA.
                Maximum winners: {maxPossibleWinners}
              </p>
            )}

          {kryptData.prizePool && maxPossibleWinners && (
            <p className="text-gray-400 text-sm mt-1">
              Pool: {kryptData.prizePool} ADA ÷ Max {maxPossibleWinners} winners
              =
              {kryptData.maxWinners
                ? ` ${(kryptData.prizePool / kryptData.maxWinners).toFixed(
                    2
                  )} ADA per winner`
                : " 2+ ADA per winner"}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                // Set both prizePool and maxWinners to null when skipping
                setKryptData((prev) => ({
                  ...prev,
                  prizePool: null,
                  maxWinners: null,
                }));
                setStep(4);
              }}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            >
              Skip Rewards
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!canProceedToStep4WithRewards}
              className={`flex items-center px-4 py-2 rounded-md ${
                canProceedToStep4WithRewards
                  ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepFour = () => (
    <div className="transition-all">
      <h2 className="text-2xl font-bold mb-6 text-[#B2F17E]">Security</h2>

      {/* Lock type selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Lock Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.NO_LOCK)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === "no lock"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <FiLock className="mr-2" />
            No Lock
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.PASSCODE)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === "passcode"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <RiLockPasswordLine className="mr-2" />
            Passcode
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.QUIZ)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === "quiz"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <RiQuestionAnswerLine className="mr-2" />
            Quiz
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.MULTPLE_CHOICE)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === KryptTypeEnum.MULTPLE_CHOICE
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <MdOutlineQuiz className="mr-2" />
            Multiple Choice
          </button>
        </div>
      </div>

      {/* Question inputs based on lock type */}
      {kryptData.type !== "no lock" && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">
            {kryptData.type === "passcode" ? "Set Passcode" : "Add Question"}
          </h3>

          {kryptData.type === "passcode" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Passcode</label>
              <input
                type="text"
                name="answer"
                value={currentQuestion.answer}
                onChange={handleQuestionChange}
                className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                placeholder="Enter passcode"
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                  placeholder="Enter your question"
                />
              </div>

              {kryptData.type === KryptTypeEnum.MULTPLE_CHOICE && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          className="flex-1 bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                          placeholder={`Option ${index + 1}`}
                        />
                        {currentQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {currentQuestion.options.length < 3 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-2 text-[#B2F17E] hover:text-opacity-80 text-sm flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add Option
                    </button>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={currentQuestion.answer}
                  onChange={handleQuestionChange}
                  className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                  placeholder="Enter the correct answer"
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={addQuestion}
            disabled={
              kryptData.type === "passcode"
                ? !currentQuestion.answer
                : !currentQuestion.question || !currentQuestion.answer
            }
            className={`flex items-center px-4 py-2 rounded-md ${
              (
                kryptData.type === "passcode"
                  ? currentQuestion.answer
                  : currentQuestion.question && currentQuestion.answer
              )
                ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiPlus className="mr-2" />
            {kryptData.type === "passcode" ? "Set Passcode" : "Add Question"}
          </button>
        </div>
      )}

      {/* Questions list */}
      {kryptData.questions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">
            {kryptData.type === "passcode" ? "Passcode Set" : "Added Questions"}
          </h3>
          <div className="space-y-3">
            {kryptData.questions.map((q, index) => (
              <div key={index} className="p-3 bg-[#333339] rounded-md">
                <div className="flex justify-between">
                  <div>
                    {kryptData.type !== "passcode" && (
                      <p className="font-medium mb-1">{q.question}</p>
                    )}
                    <p className="text-sm text-[#B2F17E]">Answer: {q.answer}</p>
                    {kryptData.type === KryptTypeEnum.MULTPLE_CHOICE &&
                      q.options.length > 0 && (
                        <div className="mt-1 text-sm text-gray-300">
                          <p>Options:</p>
                          <ul className="list-disc list-inside">
                            {q.options.map((opt, i) => (
                              <li key={i}>{opt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <div className="flex space-x-3">
          <button
            type="button"
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            <FiSave className="mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={!canSubmitForm}
            className={`flex items-center px-4 py-2 rounded-md ${
              canSubmitForm
                ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Create Krypt
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w- w-full mx-auto px-4 py-8 bg-[#222227] min-h-screen  text-white">
      {/* Progress indicators */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div
          className={`flex flex-col items-center ${
            step >= 1 ? "text-[#B2F17E]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step >= 1 ? "bg-[#B2F17E] text-[#222227]" : "bg-gray-700"
            }`}
          >
            1
          </div>
          <span>Basic Info</span>
        </div>
        <div
          className={`h-1 flex-1 mx-2 ${
            step >= 2 ? "bg-[#B2F17E]" : "bg-gray-700"
          }`}
        ></div>
        <div
          className={`flex flex-col items-center ${
            step >= 2 ? "text-[#B2F17E]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step >= 2 ? "bg-[#B2F17E] text-[#222227]" : "bg-gray-700"
            }`}
          >
            2
          </div>
          <span>Content</span>
        </div>
        <div
          className={`h-1 flex-1 mx-2 ${
            step >= 3 ? "bg-[#B2F17E]" : "bg-gray-700"
          }`}
        ></div>
        <div
          className={`flex flex-col items-center ${
            step >= 3 ? "text-[#B2F17E]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step >= 3 ? "bg-[#B2F17E] text-[#222227]" : "bg-gray-700"
            }`}
          >
            3
          </div>
          <span>Reward Pool</span>
        </div>
        <div
          className={`h-1 flex-1 mx-2 ${
            step >= 4 ? "bg-[#B2F17E]" : "bg-gray-700"
          }`}
        ></div>
        <div
          className={`flex flex-col items-center ${
            step >= 4 ? "text-[#B2F17E]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step >= 4 ? "bg-[#B2F17E] text-[#222227]" : "bg-gray-700"
            }`}
          >
            4
          </div>
          <span>Security</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && renderStepOne()}

        {/* Step 2: Content */}
        {step === 2 && renderStepTwo()}

        {/* Step 3: Reward */}
        {step === 3 && renderStepThree()}

        {/* Step 3: Security/Lock */}
        {step === 4 && renderStepFour()}
      </form>
    </div>
  );
};

export default authUserWrapper(CreateKryptForm);
