import React from "react";

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
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string | null => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return (
      <div className="bg-[#2A2A30] p-3 rounded-md text-red-400">
        Invalid YouTube URL
      </div>
    );
  }

  // Add autoplay=1 and mute=1 parameters to enable autoplay
  // Note: Modern browsers require videos to be muted for autoplay to work
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
    autoplay ? 1 : 0
  }`;

  return (
    <div className="bg-[#2A2A30] p-3 rounded-md">
      <div className="mb-2 text-sm text-gray-300">{title}</div>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded">
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
