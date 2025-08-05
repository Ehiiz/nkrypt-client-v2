import React, { useState } from "react";
import { Film, Volume2, VolumeX, Volume1 } from "lucide-react";

interface YouTubePlayerProps {
  url: string;
  title?: string;
  autoplay?: boolean;
  showVolumeControl?: boolean; // Show custom volume slider (visual only)
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  url,
  title = "YouTube Video",
  autoplay = true,
  showVolumeControl = false,
}) => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(autoplay); // Auto-mute if autoplay

  const getVideoId = (url: string): string | null => {
    const standardRegExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
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

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    if (volume < 50) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!videoId) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl text-red-400 border border-red-500 flex items-center gap-3">
        <Film size={24} />
        <span className="font-medium">Invalid YouTube URL.</span>
      </div>
    );
  }

  // Always mute autoplay videos for better UX (Chrome policy)
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
    autoplay ? 1 : 0
  }&mute=${autoplay || isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`;

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-semibold text-white">{title}</div>

        {showVolumeControl && (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-300 hover:text-white transition-colors p-1"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    isMuted ? 0 : volume
                  }%, #475569 ${isMuted ? 0 : volume}%, #475569 100%)`,
                }}
              />
              <span className="text-xs text-slate-400 w-8">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {showVolumeControl && (
        <div className="mt-2 text-xs text-slate-400 italic">
          Note: Volume control is visual only. Use YouTube&apo;s player controls
          for actual volume adjustment.
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
        }

        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
        }
      `}</style>
    </div>
  );
};

export default YouTubePlayer;
