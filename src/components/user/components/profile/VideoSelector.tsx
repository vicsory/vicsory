// VideoSelector.tsx
import { FaYoutube } from "react-icons/fa";
import { Play, Plus } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/contexts/auth-context";

interface Video {
  url: string;
  title: string;
}

interface ExtendedUserProps { // Define this based on your actual profile type
  username: string;
  // ... other properties ...
}

interface VideoSelectorProps {
  videos: Video[];
  setSelectedVideo: (url: string, title: string) => void;
  setIsPlaying: (playing: boolean) => void;
  username: string;
  profile: ExtendedUserProps; // Added profile to props
}

export default function VideoSelector({ videos, setSelectedVideo, setIsPlaying, username, profile }: VideoSelectorProps) {
  const { token } = useContext(AuthContext);
  const pathname = usePathname();

  // Debugging
  console.log('VideoSelector - Token:', token);
  console.log('VideoSelector - Token username:', token?.username);
  console.log('VideoSelector - Prop username:', username);
  console.log('VideoSelector - Profile username:', profile.username);
  console.log('VideoSelector - Pathname:', pathname);
  console.log('VideoSelector - Is owner:', token?.username?.toLowerCase() === profile.username?.toLowerCase());

  const getThumbnailUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      let videoId = "";
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.split("/")[1];
      }
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    } catch {
      return "/assets/placeholder.jpg";
    }
  };

  return (
    <div className="w-full mt-4 px-4 pb-4 border-b border-solid border-[var(--border]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-[var(--text)] font-semibold flex items-center gap-2">
          <FaYoutube size={20} />
          Videos
        </h3>
        {token?.username?.toLowerCase() === profile.username?.toLowerCase() && (
          <div className="flex gap-2 items-center">
            <Link
              href={`/${profile.username}/edit`}
              className="flex items-center gap-1 text-sm text-[var(--blue)] hover:underline"
            >
              <Plus size={16} />
              Add videos
            </Link>
          </div>
        )}
      </div>
      {videos.length > 0 ? (
        <div className="w-full overflow-x-auto scrollbar-hide py-2">
          <div className="flex flex-nowrap gap-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="relative cursor-pointer group flex-shrink-0 w-48"
                onClick={() => {
                  setSelectedVideo(video.url, video.title);
                  setIsPlaying(true);
                }}
              >
                <img
                  src={getThumbnailUrl(video.url)}
                  alt={video.title || "Video thumbnail"}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={24} color="white" />
                </div>
                <p className="mt-2 text-sm text-[var(--text)] line-clamp-2">
                  {video.title || "Untitled Video"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[var(--text-secondary)] text-sm flex items-center justify-center">
          {token?.username?.toLowerCase() === profile.username?.toLowerCase()
            ? "You haven't added any videos yet."
            : "No additional videos available."}
        </p>
      )}
    </div>
  );
}