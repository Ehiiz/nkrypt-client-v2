import { KryptTypeEnum } from "@/app/_hooks/user/krypt/krypt.interface";

export interface UnsplashUser {
  id: string;
  name: string;
  username: string;
}

export interface UnsplashUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface UnsplashImage {
  id: string;
  alt_description: string | null;
  urls: UnsplashUrls;
  user: UnsplashUser;
  width: number;
  height: number;
  likes: number;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export type ContentItem = {
  type: "text" | "image" | "sound";
  content: string;
};

export type Question = {
  question: string;
  options: string[];
  answer: string;
  index: number;
};

export type KryptData = {
  title: string;
  description: string;
  content: ContentItem[];
  type: KryptTypeEnum;
  draft: boolean;
  questions: Question[];
  tags: string[]; // Add tagIds array to store the user tags
  maxWinners?: number | null; // Optional field for maximum winners
  prizePool?: number | null;
  backgroundMusic?: string;
  isPublic?: boolean;
};

export interface YouTubeSong {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  url: string;
}

export interface ContentItemWithPreview extends ContentItem {
  id?: string;
  metadata?: {
    title?: string;
    artist?: string;
    thumbnail?: string;
    duration?: string;
  };
}
