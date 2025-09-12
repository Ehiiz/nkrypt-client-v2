/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Upload,
  Youtube,
  Image,
  Music,
  Lock,
  Save,
  Check,
  Search,
  Text,
  LockKeyhole,
  LockOpen,
  HelpCircle,
  Award,
  Wallet,
  Loader2,
  Link as LinkIcon,
  Globe,
  EyeOff,
} from "lucide-react";
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { KryptTypeEnum } from "@/app/_hooks/user/krypt/krypt.interface";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { useRouter } from "next/navigation";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import { UserTagInput } from "@/app/_components/cards/userTags";
import NextImage from "next/image";
import Link from "next/link";
import {
  ContentItem,
  KryptData,
  Question,
  UnsplashImage,
  UnsplashSearchResponse,
  YouTubeSong,
} from "@/app/_utils/interfaces/util.interface";
import { UnsplashSearch } from "@/app/_components/inputs/unsplashsearch";
import YouTubePlayer from "@/app/_components/players/youtubeMusicPlayer";

const CreateKryptForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<boolean[]>([]);

  const [kryptData, setKryptData] = useState<KryptData>({
    title: "",
    description: "",
    content: [],
    type: KryptTypeEnum.NO_LOCK,
    draft: true,
    questions: [],
    tags: [],
    maxWinners: null,
    prizePool: null,
    backgroundMusic: undefined,
    isPublic: true,
  });

  useEffect(() => {
    setExpandedItems(new Array(kryptData.content.length).fill(false));
  }, [kryptData.content.length]);

  const toggleExpand = (index: number) => {
    const newExpandedItems = [...expandedItems];
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  const [walletValid, setWalletValid] = useState<boolean>(true);
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
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState<string>("");
  const [youtubeSearchResults, setYoutubeSearchResults] = useState<
    YouTubeSong[]
  >([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [backgroundMusic, setBackgroundMusic] = useState<YouTubeSong | null>(
    null
  );

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setKryptData({
      ...kryptData,
      [name]: value,
    });
  };

  const handlePublicToggleChange = () => {
    setKryptData((prev) => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
  };

  const handleRewardInfoChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? null : parseInt(value, 10);

    if (name === "prizePool" && numericValue !== null && numericValue > 0) {
      try {
        const data = await UserKryptService.checkBalance({
          amount: numericValue,
        });
        setWalletValid(data.success && data.data!.valid);
      } catch (error) {
        setWalletValid(false);
      }
    } else if (name === "prizePool") {
      setWalletValid(true);
    }
    setKryptData({
      ...kryptData,
      [name]: numericValue,
    });
  };

  const searchUnsplashImages = async (query: string): Promise<void> => {
    if (!query.trim()) return;
    setIsSearchingUnsplash(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );
      if (response.ok) {
        const data: UnsplashSearchResponse = await response.json();
        setUnsplashResults(data.results || []);
        setShowUnsplashResults(true);
      } else {
        setUnsplashResults([]);
        toastAlert({
          type: ToastType.error,
          message: "Failed to search images. Please try again.",
        });
      }
    } catch (error) {
      setUnsplashResults([]);
      toastAlert({
        type: ToastType.error,
        message: "Network error occurred while searching images.",
      });
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  const handleUnsplashImageSelect = (image: UnsplashImage): void => {
    handleContentValueChange(image.urls.regular);
    setShowUnsplashResults(false);
    setUnsplashSearchQuery("");
    setUnsplashResults([]);
  };

  const hasImageError = (url: string): boolean => false;

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
        url: `http://googleusercontent.com/youtube.com/${item.id}`,
      }));
      setYoutubeSearchResults(results);
    } catch (error) {
      setYoutubeSearchResults([]);
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

  const handleBackgroundMusicSelect = (song: YouTubeSong): void => {
    setBackgroundMusic(song);
    setKryptData({
      ...kryptData,
      backgroundMusic: song.url,
    });
    setYoutubeSearchResults([]);
    setYoutubeSearchQuery("");
  };

  const removeBackgroundMusic = (): void => {
    setBackgroundMusic(null);
  };

  const handleTagsChange = useCallback((tags: any[]) => {
    setKryptData((prev) => ({
      ...prev,
      tags,
    }));
  }, []);

  const handleContentTypeChange: any = (type: "text" | "image" | "sound") => {
    setCurrentContent({ ...currentContent, type });
  };

  const handleContentValueChange = (value: string) => {
    setCurrentContent({ ...currentContent, content: value });
  };

  const addContentItem = () => {
    if (currentContent.content.trim()) {
      setKryptData({
        ...kryptData,
        content: [...kryptData.content, { ...currentContent }],
      });
      setCurrentContent({ type: "text", content: "" });
    }
  };

  const removeContentItem = (index: number) => {
    const newContent = [...kryptData.content];
    newContent.splice(index, 1);
    setKryptData({ ...kryptData, content: newContent });
  };

  const handleLockTypeChange = (type: KryptTypeEnum) => {
    if (type === "no lock") {
      setKryptData({ ...kryptData, type, questions: [] });
    } else {
      setKryptData({ ...kryptData, type });
    }
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion({ ...currentQuestion, [name]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addOption = () => {
    if (currentQuestion.options.length < 3) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = [...currentQuestion.options];
      newOptions.splice(index, 1);
      setCurrentQuestion({ ...currentQuestion, options: newOptions });
    }
  };

  const addQuestion = () => {
    if (kryptData.type === "passcode") {
      if (currentQuestion.answer.trim()) {
        const passcodeQuestion = {
          question: "Enter passcode:",
          options: [],
          answer: currentQuestion.answer.trim(),
          index: 1,
        };
        setKryptData({ ...kryptData, questions: [passcodeQuestion] });
        setCurrentQuestion({
          question: "",
          options: ["", ""],
          answer: "",
          index: 0,
        });
      }
    } else if (
      currentQuestion.question.trim() &&
      currentQuestion.answer.trim()
    ) {
      const newQuestion = {
        ...currentQuestion,
        index: kryptData.questions.length + 1,
      };
      setKryptData({
        ...kryptData,
        questions: [...kryptData.questions, newQuestion],
      });
      setCurrentQuestion({
        question: "",
        options: ["", ""],
        answer: "",
        index: 0,
      });
    }
  };

  const removeQuestion = (index: number) => {
    const newQuestions = kryptData.questions.filter((_, i) => i !== index);
    const updatedQuestions = newQuestions.map((q, i) => ({
      ...q,
      index: i + 1,
    }));
    setKryptData({ ...kryptData, questions: updatedQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = JSON.parse(JSON.stringify(kryptData));
    if (submissionData.type === KryptTypeEnum.NO_LOCK) {
      delete submissionData.questions;
    } else if (submissionData.type === KryptTypeEnum.PASSCODE) {
      submissionData.questions = submissionData.questions.map(
        (q: { answer: any; index: any }) => ({
          answer: q.answer,
          index: q.index,
        })
      );
    } else if (submissionData.type === KryptTypeEnum.QUIZ) {
      submissionData.questions = submissionData.questions.map(
        (q: { question: any; answer: any; index: any }) => ({
          question: q.question,
          answer: q.answer,
          index: q.index,
        })
      );
    }

    try {
      const data = await UserKryptService.createKrypt(submissionData);
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
    } catch (error) {
      toastAlert({
        type: ToastType.error,
        message: "Failed to create Krypt. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setIsSubmitting(true);
    try {
      const data = await UserKryptService.createKrypt({
        ...kryptData,
        draft: true,
      });
      if (data.success) {
        toastAlert({
          type: ToastType.success,
          message: "Krypt saved as a draft!",
        });
        router.push(`/dashboard`);
      } else {
        toastAlert({ type: ToastType.error, message: "Failed to save draft." });
      }
    } catch (error) {
      toastAlert({ type: ToastType.error, message: "Failed to save draft." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 =
    kryptData.title.trim() !== "" && kryptData.description.trim() !== "";
  const canProceedToStep3 = kryptData.content.length > 0;

  const canSubmitForm =
    kryptData.type === KryptTypeEnum.NO_LOCK ||
    (kryptData.type === KryptTypeEnum.PASSCODE &&
      kryptData.questions.length === 1 &&
      kryptData.questions[0].answer) ||
    ((kryptData.type === KryptTypeEnum.QUIZ ||
      kryptData.type === KryptTypeEnum.MULTPLE_CHOICE) &&
      kryptData.questions.length > 0);

  const renderStepOne = () => (
    <div className="transition-all">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Basic Information
      </h2>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={kryptData.title}
          onChange={handleBasicInfoChange}
          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          placeholder="Enter krypt title"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={kryptData.description}
          onChange={handleBasicInfoChange}
          rows={4}
          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none"
          placeholder="Enter krypt description"
        />
      </div>
      <div className="mb-6">
        <UserTagInput
          label="Tag Users (Optional)"
          placeholder="Search for users to tag..."
          required={false}
          onChange={handleTagsChange}
          className="mb-4"
        />
      </div>

      <div className="mb-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {kryptData.isPublic ? (
            <Globe className="text-green-400" size={24} />
          ) : (
            <EyeOff className="text-red-400" size={24} />
          )}
          <div>
            <label
              htmlFor="public-toggle"
              className="font-semibold text-white cursor-pointer"
            >
              {kryptData.isPublic ? "Public Krypt" : "Private Krypt"}
            </label>
            <p className="text-sm text-slate-400">
              {kryptData.isPublic
                ? "Visible to everyone on the timeline."
                : "Only visible to tagged users."}
            </p>
          </div>
        </div>
        <div
          className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            kryptData.isPublic ? "bg-purple-600" : "bg-slate-600"
          }`}
          onClick={handlePublicToggleChange}
        >
          <input
            type="checkbox"
            id="public-toggle"
            className="sr-only"
            checked={kryptData.isPublic}
            onChange={handlePublicToggleChange}
          />
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              kryptData.isPublic ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={!canProceedToStep2}
          className={`group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg
            ${
              canProceedToStep2
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStepTwo = () => {
    return (
      <div className="transition-all">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Content & Music
        </h2>
        <div className="mb-8 p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-white">Content</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content Type
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => handleContentTypeChange("text")}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors border
                  ${
                    currentContent.type === "text"
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-600/60 hover:text-white"
                  }`}
              >
                <Text className="mr-2" />
                Text
              </button>
              <button
                type="button"
                onClick={() => handleContentTypeChange("image")}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors border
                  ${
                    currentContent.type === "image"
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-600/60 hover:text-white"
                  }`}
              >
                <Image className="mr-2" />
                Image
              </button>
            </div>
          </div>
          <div className="mb-6">
            {currentContent.type === "text" && (
              <div>
                <label
                  htmlFor="text-content"
                  className="block text-sm font-medium text-slate-300 mb-1"
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
                  className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none"
                  placeholder="Enter your text content"
                />
              </div>
            )}
            {currentContent.type === "image" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image Source
                </label>
                <div className="flex space-x-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setShowUnsplashResults(!showUnsplashResults)}
                    className="flex items-center px-4 py-2 bg-slate-700/60 text-slate-400 rounded-lg hover:bg-slate-600/60 hover:text-white transition-colors"
                  >
                    <Image className="mr-2" />
                    Unsplash
                  </button>
                </div>
                {showUnsplashResults && (
                  <UnsplashSearch
                    unsplashSearchQuery={unsplashSearchQuery}
                    setUnsplashSearchQuery={setUnsplashSearchQuery}
                    searchUnsplashImages={searchUnsplashImages}
                    isSearchingUnsplash={isSearchingUnsplash}
                    unsplashResults={unsplashResults}
                    handleUnsplashImageSelect={handleUnsplashImageSelect}
                    setShowUnsplashResults={setShowUnsplashResults}
                  />
                )}
                <input
                  type="url"
                  value={currentContent.content}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleContentValueChange(e.target.value)
                  }
                  className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors mt-4"
                  placeholder="https://example.com/image.jpg"
                />
                {currentContent.content &&
                  !hasImageError(currentContent.content) && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-48 h-32 border border-slate-600 rounded-lg overflow-hidden shadow-lg">
                        <NextImage
                          src={currentContent.content}
                          alt="Content preview"
                          fill
                          className="object-cover"
                          onError={() =>
                            handleImageError(currentContent.content)
                          }
                        />
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
          <div className="mb-6">
            <button
              type="button"
              onClick={addContentItem}
              disabled={!currentContent.content.trim()}
              className={`group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg
                ${
                  currentContent.content.trim()
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
            >
              <Plus className="mr-2" />
              Add Content Item
            </button>
          </div>
          {kryptData.content.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300">
                Added Content
              </h4>
              {kryptData.content.map((item: ContentItem, index: number) => (
                <div
                  key={`content-${index}`}
                  className="flex items-start justify-between p-4 bg-slate-700/60 rounded-xl border border-slate-600 shadow-md"
                >
                  <div className="flex items-start flex-1 min-w-0">
                    {item.type === "text" && (
                      <>
                        <Text
                          className="mr-3 text-purple-400 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <div className="flex-1 min-w-0 break-words">
                          <p className="text-sm text-slate-400">Text Content</p>
                          <p className="text-white whitespace-pre-wrap">
                            {expandedItems[index] || item.content.length <= 100
                              ? item.content
                              : `${item.content.substring(0, 100)}...`}
                          </p>
                          {item.content.length > 100 && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(index)}
                              className="text-purple-400 hover:underline text-sm font-medium mt-1"
                            >
                              {expandedItems[index] ? "Show Less" : "Show More"}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                    {item.type === "image" && (
                      <>
                        <div className="mr-3 flex-shrink-0">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-600">
                            <NextImage
                              src={item.content}
                              alt="Content preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 break-words">
                          <p className="text-sm text-slate-400">Image</p>
                          <p className="text-white text-sm break-all">
                            {item.content}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContentItem(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8 p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Music className="mr-2 text-purple-400" />
            Background Music (Optional)
          </h3>
          {!backgroundMusic ? (
            <div>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
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
                    className="flex-1 bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Search for background music..."
                  />
                  <button
                    type="button"
                    onClick={() => searchYouTubeMusic(youtubeSearchQuery)}
                    disabled={!youtubeSearchQuery.trim() || isSearching}
                    className={`flex items-center p-3 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all shadow-md
                      ${
                        youtubeSearchQuery.trim() && !isSearching
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105"
                          : "bg-slate-700 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    {isSearching ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Youtube size={20} className="sm:mr-2" />
                    )}
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
                {youtubeSearchResults.length > 0 && (
                  <div className="mt-4 max-h-60 overflow-y-auto bg-slate-700/60 border border-slate-600 rounded-lg shadow-inner">
                    {youtubeSearchResults.map((song: YouTubeSong) => (
                      <div
                        key={song.id}
                        onClick={() => handleBackgroundMusicSelect(song)}
                        className="flex items-center p-3 hover:bg-slate-600/60 cursor-pointer border-b border-slate-600 last:border-b-0 transition-colors"
                      >
                        <div className="relative w-12 h-12 mr-3 rounded-md overflow-hidden flex-shrink-0">
                          <NextImage
                            src={song.thumbnail}
                            alt={`${song.title} thumbnail`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white">{song.title}</p>
                          <p className="text-sm text-slate-400">
                            {song.artist}
                          </p>
                        </div>
                        <span className="text-sm text-slate-400 flex-shrink-0 ml-4">
                          {song.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-600 pt-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Or enter YouTube Music URL directly
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/embed/..."
                    className="flex-1 bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        const url = e.currentTarget.value;
                        if (url.trim()) {
                          const mockSong: YouTubeSong = {
                            id: "manual",
                            title: "Manual Selection",
                            artist: "Custom URL",
                            thumbnail: "https://via.placeholder.com/48",
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
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 border border-purple-500 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4 rounded-md overflow-hidden flex-shrink-0">
                    <NextImage
                      src={backgroundMusic.thumbnail}
                      alt={`${backgroundMusic.title} thumbnail`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-lg">
                      {backgroundMusic.title}
                    </p>
                    <p className="text-slate-300">{backgroundMusic.artist}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeBackgroundMusic}
                  className="ml-4 p-2 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
          >
            <ArrowLeft className="mr-2" />
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            disabled={kryptData.content.length === 0}
            className={`group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg
              ${
                kryptData.content.length > 0
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
          >
            Next <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  const renderStepThree = () => {
    const maxPossibleWinners = kryptData.prizePool
      ? Math.floor(kryptData.prizePool / 2)
      : null;
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
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Reward Information
        </h2>
        <div className="mb-4">
          <label
            htmlFor="prizePool"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            ADA Reward
          </label>
          <input
            type="number"
            id="prizePool"
            name="prizePool"
            value={kryptData.prizePool ?? ""}
            onChange={handleRewardInfoChange}
            className={`w-full bg-slate-700/60 border ${
              !walletValid && kryptData.prizePool
                ? "border-red-500"
                : "border-slate-600"
            } rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
            placeholder="Enter ADA reward amount (optional)"
            min="0"
          />
          {!walletValid && kryptData.prizePool && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <Lock className="mr-2" size={16} /> Insufficient balance
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="maxWinners"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Max Winners
            {kryptData.prizePool && <span className="text-red-400">*</span>}
          </label>
          <input
            type="number"
            id="maxWinners"
            name="maxWinners"
            value={kryptData.maxWinners ?? ""}
            onChange={handleRewardInfoChange}
            className={`w-full bg-slate-700/60 border ${
              kryptData.prizePool &&
              (!kryptData.maxWinners || !isMaxWinnersValid)
                ? "border-red-500"
                : "border-slate-600"
            } rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
            placeholder={
              kryptData.prizePool
                ? `Enter max winners (required, max: ${maxPossibleWinners})`
                : "Enter maximum number of winners (optional)"
            }
            min="1"
            max={maxPossibleWinners || undefined}
            disabled={!kryptData.prizePool}
          />
          {kryptData.prizePool && !kryptData.maxWinners && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <Award className="mr-2" size={16} /> Max winners is required when
              prize pool is set
            </p>
          )}
          {kryptData.prizePool &&
            kryptData.maxWinners &&
            kryptData.maxWinners > maxPossibleWinners! && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <Award className="mr-2" size={16} /> Too many winners! Each
                winner must receive at least 2 ADA. Maximum winners:{" "}
                {maxPossibleWinners}
              </p>
            )}
          {kryptData.prizePool && maxPossibleWinners && (
            <p className="text-slate-400 text-sm mt-2">
              <Wallet className="mr-2 inline" size={16} /> Pool:{" "}
              {kryptData.prizePool} ADA ÷ Max {maxPossibleWinners} winners ={" "}
              {kryptData.maxWinners
                ? `${(kryptData.prizePool / kryptData.maxWinners).toFixed(
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
            className="flex items-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
          >
            <ArrowLeft className="mr-2" />
            Back
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setKryptData((prev) => ({
                  ...prev,
                  prizePool: null,
                  maxWinners: null,
                }));
                setStep(4);
              }}
              className="px-6 py-3 text-slate-400 hover:text-white transition-colors font-semibold"
            >
              Skip Rewards
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!canProceedToStep4WithRewards}
              className={`group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg
                ${
                  canProceedToStep4WithRewards
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
            >
              Next <ArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepFour = () => (
    <div className="transition-all">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Security
      </h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Lock Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.NO_LOCK)}
            className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-colors
              ${
                kryptData.type === KryptTypeEnum.NO_LOCK
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg"
                  : "bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-600/60 hover:text-white"
              }`}
          >
            <LockOpen className="mb-2" size={24} />
            <span className="font-semibold text-sm">No Lock</span>
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.PASSCODE)}
            className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-colors
              ${
                kryptData.type === KryptTypeEnum.PASSCODE
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg"
                  : "bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-600/60 hover:text-white"
              }`}
          >
            <LockKeyhole className="mb-2" size={24} />
            <span className="font-semibold text-sm">Passcode</span>
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.QUIZ)}
            className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-colors
              ${
                kryptData.type === KryptTypeEnum.QUIZ
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg"
                  : "bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-600/60 hover:text-white"
              }`}
          >
            <HelpCircle className="mb-2" size={24} />
            <span className="font-semibold text-sm">Quiz</span>
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.MULTPLE_CHOICE)}
            className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-colors
              ${
                kryptData.type === KryptTypeEnum.MULTPLE_CHOICE
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg"
                  : "bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-600/60 hover:text-white"
              }`}
          >
            <Check className="mb-2" size={24} />
            <span className="font-semibold text-sm">Multiple Choice</span>
          </button>
        </div>
      </div>
      {kryptData.type !== KryptTypeEnum.NO_LOCK && (
        <div className="mb-6 p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-3 text-white">
            {kryptData.type === KryptTypeEnum.PASSCODE
              ? "Set Passcode"
              : "Add Question"}
          </h3>
          {kryptData.type === KryptTypeEnum.PASSCODE ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Passcode
              </label>
              <input
                type="text"
                name="answer"
                value={currentQuestion.answer}
                onChange={handleQuestionChange}
                className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter passcode"
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your question"
                />
              </div>
              {kryptData.type === KryptTypeEnum.MULTPLE_CHOICE && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
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
                          className="flex-1 bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={`Option ${index + 1}`}
                        />
                        {currentQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="ml-2 p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {currentQuestion.options.length < 3 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-2 text-purple-400 hover:text-purple-300 text-sm flex items-center font-medium"
                    >
                      <Plus className="mr-1" size={16} /> Add Option
                    </button>
                  )}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Answer
                </label>
                <input
                  type="text"
                  name="answer"
                  value={currentQuestion.answer}
                  onChange={handleQuestionChange}
                  className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter the correct answer"
                />
              </div>
            </>
          )}
          <button
            type="button"
            onClick={addQuestion}
            disabled={
              kryptData.type === KryptTypeEnum.PASSCODE
                ? !currentQuestion.answer
                : !currentQuestion.question || !currentQuestion.answer
            }
            className={`group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg
              ${
                (
                  kryptData.type === KryptTypeEnum.PASSCODE
                    ? currentQuestion.answer
                    : currentQuestion.question && currentQuestion.answer
                )
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
          >
            <Plus className="mr-2" />
            {kryptData.type === KryptTypeEnum.PASSCODE
              ? "Set Passcode"
              : "Add Question"}
          </button>
        </div>
      )}
      {kryptData.questions.length > 0 && (
        <div className="mb-6 p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-3 text-white">
            {kryptData.type === KryptTypeEnum.PASSCODE
              ? "Passcode Set"
              : "Added Questions"}
          </h3>
          <div className="space-y-3">
            {kryptData.questions.map((q, index) => (
              <div
                key={index}
                className="flex justify-between items-start p-4 bg-slate-700/60 rounded-xl border border-slate-600 shadow-md"
              >
                <div className="flex-1 min-w-0">
                  {kryptData.type !== KryptTypeEnum.PASSCODE && (
                    <p className="font-medium text-white mb-1">{q.question}</p>
                  )}
                  <p className="text-sm text-purple-400">Answer: {q.answer}</p>
                  {kryptData.type === KryptTypeEnum.MULTPLE_CHOICE &&
                    q.options.length > 0 && (
                      <div className="mt-2 text-sm text-slate-400">
                        <p className="font-medium">Options:</p>
                        <ul className="list-disc list-inside ml-4 mt-1">
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
                  className="ml-4 p-2 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="flex items-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
        >
          <ArrowLeft className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(5)}
          disabled={!canSubmitForm}
          className={`group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg
              ${
                canSubmitForm
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
        >
          Preview Krypt <ArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const PreviewYouTubePlayer = ({
    url,
    title,
  }: {
    url: string;
    title: string;
  }) => (
    <div className="p-4 bg-slate-900/70 rounded-lg border border-slate-700">
      <p className="text-sm font-semibold text-white mb-2">{title}</p>
      <div className="flex items-center space-x-3">
        <Youtube size={24} className="text-red-500" />
        <span className="text-purple-400 text-xs break-all">{url}</span>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        (YouTube Player will be shown here)
      </p>
    </div>
  );

  const renderStepFive = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="transition-all">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Preview
        </h2>
        <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700 max-w-3xl mx-auto w-full mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
              <NextImage
                src={"/placeholder-avatar.png"}
                alt="Your avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-lg text-white">Your Name</p>
              <p className="text-xs text-slate-400">
                Published on {currentDate}
              </p>
            </div>
            <div
              className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                kryptData.isPublic
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {kryptData.isPublic ? <Globe size={14} /> : <EyeOff size={14} />}
              {kryptData.isPublic ? "Public" : "Private"}
            </div>
          </div>
          <div className="mb-6 p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              {kryptData.title}
            </h1>
            <p style={{ whiteSpace: "pre-wrap" }} className="text-slate-300">
              {kryptData.description}
            </p>
            {kryptData.tags && kryptData.tags.length > 0 && (
              <div className="flex flex-wrap mt-4 gap-2 mb-3">
                {kryptData.tags.map((tag: any) => (
                  <div
                    key={tag.id}
                    className="group flex items-center bg-slate-700/40 rounded-full px-3 py-1"
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-slate-500">
                      <NextImage
                        src={tag.profileImage || "/placeholder-avatar.png"}
                        alt={tag.username}
                        width={20}
                        height={20}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-xs text-slate-300">
                      {tag.username}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-xl">
            {kryptData.content.map((item, index) => (
              <div key={index} className="mb-4">
                {item.type === "text" && (
                  <p
                    style={{ whiteSpace: "pre-wrap" }}
                    className="text-slate-200 whitespace-pre-wrap leading-relaxed"
                  >
                    {item.content}
                  </p>
                )}
                {item.type === "image" && (
                  <div className="my-4 rounded-lg overflow-hidden border border-slate-600 shadow-md">
                    <div
                      className="relative w-full"
                      style={{ paddingTop: "56.25%" }}
                    >
                      {" "}
                      {/* 16:9 Aspect Ratio */}
                      <NextImage
                        src={item.content}
                        alt="Krypt content preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {backgroundMusic && (
              <div className="mt-6">
                <YouTubePlayer
                  url={backgroundMusic.url!}
                  title={backgroundMusic.title}
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
            <div className="flex space-x-4 text-center">
              <div>
                <p className="font-bold text-lg">0</p>
                <p className="text-xs text-slate-400">Comments</p>
              </div>
              <div>
                <p className="font-bold text-lg">0</p>
                <p className="text-xs text-slate-400">Successes</p>
              </div>
              <div>
                <p className="font-bold text-lg">0</p>
                <p className="text-xs text-slate-400">Failures</p>
              </div>
            </div>
            <button
              disabled
              className="px-4 py-2 bg-slate-700 text-slate-400 rounded-lg font-semibold cursor-not-allowed"
            >
              Share
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(4)}
            className="flex items-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
          >
            <ArrowLeft className="mr-2" />
            Back
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
              className={`flex items-center px-6 py-3 rounded-lg text-white font-semibold transition-colors shadow-md ${
                isSubmitting
                  ? "bg-slate-700/60 text-slate-400 cursor-not-allowed"
                  : "bg-slate-600 hover:bg-slate-500"
              }`}
            >
              <Save className="mr-2" />
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={!canSubmitForm || isSubmitting}
              className={`group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg
              ${
                canSubmitForm && !isSubmitting
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Create Krypt"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen lg:min-h-0 flex flex-col mx-auto p-4 sm:p-8 bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-2xl text-white">
      <div className="flex items-center justify-between mb-8 text-xs sm:text-sm max-w-3xl mx-auto w-full">
        {/* Step 1 */}
        <div
          className={`flex flex-col items-center relative z-10 ${
            step >= 1 ? "text-purple-400" : "text-slate-400"
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300
              ${
                step >= 1
                  ? "bg-purple-600 text-white ring-2 ring-purple-400"
                  : "bg-slate-700 text-slate-400 ring-1 ring-slate-600"
              }`}
          >
            1
          </div>
          <span className="sm:inline hidden">Basic Info</span>
          <span className="sm:hidden">Info</span>
        </div>
        <div
          className={`h-1 flex-1 mx-1 transition-colors duration-300 ${
            step >= 2 ? "bg-purple-500" : "bg-slate-700"
          }`}
        ></div>
        {/* Step 2 */}
        <div
          className={`flex flex-col items-center relative z-10 ${
            step >= 2 ? "text-purple-400" : "text-slate-400"
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300
              ${
                step >= 2
                  ? "bg-purple-600 text-white ring-2 ring-purple-400"
                  : "bg-slate-700 text-slate-400 ring-1 ring-slate-600"
              }`}
          >
            2
          </div>
          <span className="sm:inline hidden">Content</span>
          <span className="sm:hidden">Content</span>
        </div>
        <div
          className={`h-1 flex-1 mx-1 transition-colors duration-300 ${
            step >= 3 ? "bg-purple-500" : "bg-slate-700"
          }`}
        ></div>
        {/* Step 3 */}
        <div
          className={`flex flex-col items-center relative z-10 ${
            step >= 3 ? "text-purple-400" : "text-slate-400"
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300
              ${
                step >= 3
                  ? "bg-purple-600 text-white ring-2 ring-purple-400"
                  : "bg-slate-700 text-slate-400 ring-1 ring-slate-600"
              }`}
          >
            3
          </div>
          <span className="sm:inline hidden">Reward Pool</span>
          <span className="sm:hidden">Reward</span>
        </div>
        <div
          className={`h-1 flex-1 mx-1 transition-colors duration-300 ${
            step >= 4 ? "bg-purple-500" : "bg-slate-700"
          }`}
        ></div>
        {/* Step 4 */}
        <div
          className={`flex flex-col items-center relative z-10 ${
            step >= 4 ? "text-purple-400" : "text-slate-400"
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300
              ${
                step >= 4
                  ? "bg-purple-600 text-white ring-2 ring-purple-400"
                  : "bg-slate-700 text-slate-400 ring-1 ring-slate-600"
              }`}
          >
            4
          </div>
          <span className="sm:inline hidden">Security</span>
          <span className="sm:hidden">Lock</span>
        </div>
        <div
          className={`h-1 flex-1 mx-1 transition-colors duration-300 ${
            step >= 5 ? "bg-purple-500" : "bg-slate-700"
          }`}
        ></div>
        {/* Step 5 */}
        <div
          className={`flex flex-col items-center relative z-10 ${
            step >= 5 ? "text-purple-400" : "text-slate-400"
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300
              ${
                step >= 5
                  ? "bg-purple-600 text-white ring-2 ring-purple-400"
                  : "bg-slate-700 text-slate-400 ring-1 ring-slate-600"
              }`}
          >
            5
          </div>
          <span className="sm:inline hidden">Preview</span>
          <span className="sm:hidden">Preview</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 flex-1">
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
        {step === 4 && renderStepFour()}
        {step === 5 && renderStepFive()}
      </form>
    </div>
  );
};

export default authUserWrapper(CreateKryptForm);
