"use client";

import { ProfileProps } from "@/types/UserProps";
import { FastForward, Maximize, Play, Repeat, Rewind, useRef, useState, Volume2, VolumeX } from "./imports";

export default function VideoPlayer({ profile }: ProfileProps) {
  const [isPlaying, setIsPlaying] = useState(!!profile.youtubePlayerUrl);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      if (!url) return "";
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      let videoId = "";
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.split("/")[1];
      }
      return videoId 
        ? `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`
        : "";
    } catch (error) {
      console.error("Invalid YouTube URL:", error);
      return "";
    }
  };

  const handlePlayToggle = () => {
    setIsPlaying(prev => !prev);
    if (!isPlaying && videoRef.current) {
      setIsMuted(true);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"seekTo","args":[0,true]}',
        '*'
      );
      setIsPlaying(true);
    }
  };

  const handleSeekBackward = () => {
    if (videoRef.current) {
      videoRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"seekTo","args":[-10,true]}',
        '*'
      );
    }
  };

  const handleSeekForward = () => {
    if (videoRef.current) {
      videoRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"seekTo","args":[10,true]}',
        '*'
      );
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    profile.youtubePlayerUrl && (
      <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
        {isPlaying && (
          <>
            <div className="absolute top-2 right-2 flex items-center gap-2 z-20 bg-black/60 rounded-full px-3 py-1">
              {profile.youtubePlayerTitle && (
                <span className="text-white text-sm font-medium truncate max-w-[200px]">
                  {profile.youtubePlayerTitle}
                </span>
              )}
              <button
                type="button"
                onClick={handlePlayToggle}
                className="w-8 h-8 rounded-full bg-[var(--blue)] hover:bg-[var(--hover-blue)] flex items-center justify-center transition-all duration-200"
                title={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <Play size={16} color="white" className="ml-1" />
                )}
              </button>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/60 rounded-full py-1 px-3">
              <button onClick={handleSeekBackward} className="w-8 h-8 rounded-full bg-[var(--blue)] hover:bg-[var(--hover-blue)] flex items-center justify-center transition-all duration-200" title="Rewind 10 seconds">
                <Rewind size={16} color="white" />
              </button>
              <button onClick={handleSeekForward} className="w-8 h-8 rounded-full bg-[var(--blue)] hover:bg-[var(--hover-blue)] flex items-center justify-center transition-all duration-200" title="Fast forward 10 seconds">
                <FastForward size={16} color="white" />
              </button>
              <button onClick={handleMuteToggle} className="w-8 h-8 rounded-full bg-[var(--blue)] hover:bg-[var(--hover-blue)] flex items-center justify-center transition-all duration-200" title={isMuted ? "Unmute video" : "Mute video"}>
                {isMuted ? <VolumeX size={16} color="white" /> : <Volume2 size={16} color="white" />}
              </button>
              <button onClick={handleReplay} className="w-8 h-8 rounded-full bg-[var(--blue)] hover:bg-[var(--hover-blue)] flex items-center justify-center transition-all duration-200" title="Replay video">
                <Repeat size={16} color="white" />
              </button>
              <button onClick={handleFullscreen} className="w-8 h-8 rounded-full bg-[var(--blue)] hover:bg-[var(--hover-blue)] flex items-center justify-center transition-all duration-200" title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                <Maximize size={16} color="white" />
              </button>
            </div>
          </>
        )}
        {isPlaying && (
          <iframe
            ref={videoRef}
            src={getYoutubeEmbedUrl(profile.youtubePlayerUrl)}
            title={profile.youtubePlayerTitle || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
            style={{ border: 0 }}
          />
        )}
      </div>
    )
  );
}