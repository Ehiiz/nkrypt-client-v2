import React from "react";
import { Film } from "lucide-react"; // Replaced with a Lucide icon for consistency

interface YouTubePlayerProps {
  url: string;
  title?: string;
  autoplay?: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  url,
  title = "YouTube Video",
  autoplay = true,
}) => {
  const getVideoId = (url: string): string | null => {
    // Regex for standard YouTube URLs (watch?v=, youtu.be, embed/)
    const standardRegExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

    // Regex for the new format: http://googleusercontent.com/youtube.com/[videoId]
    const customRegExp =
      /^.*(http:\/\/googleusercontent\.com\/youtube\.com\/)([a-zA-Z0-9_-]{11})/;

    const standardMatch = url.match(standardRegExp);
    const customMatch = url.match(customRegExp);

    if (standardMatch && standardMatch[7].length === 11) {
      return standardMatch[7];
    }

    if (customMatch && customMatch[2].length === 11) {
      return customMatch[2];
    }

    return null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl text-red-400 border border-red-500 flex items-center gap-3">
        <Film size={24} />
        <span className="font-medium">Invalid YouTube URL.</span>
      </div>
    );
  }

  // Use a standard YouTube embed URL with the extracted videoId
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
    autoplay ? 1 : 0
  }&mute=${autoplay ? 1 : 0}`;

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl shadow-lg">
      <div className="mb-2 text-base font-semibold text-white">{title}</div>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;
