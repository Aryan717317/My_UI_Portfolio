import React, { useRef, useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Youtube, Plus, Sparkles } from "lucide-react";

export interface Track {
  title: string;
  artist: string;
  src: string;
  coverArt: string;
  youtubeId?: string; // Optional YouTube Video ID
}

const PLAYLIST: Track[] = [
  {
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    src: "",
    youtubeId: "dQw4w9WgXcQ",
    coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Du bist gut genug",
    artist: "LEA",
    src: "",
    youtubeId: "WzY_Yy3mNhs",
    coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Brazilian Phonk (Baile Funk)",
    artist: "Rio de Janeiro Mix",
    src: "",
    youtubeId: "T38a9EshGZg",
    coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Chill Piano Focus",
    artist: "Acoustic Flow",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    coverArt: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Synthwave Coder",
    artist: "Cyber Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverArt: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"
  }
];

export interface MusicPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional custom tracks list, defaults to built-in playlist */
  tracks?: Track[];
  /** Whether to auto-play on load */
  autoPlay?: boolean;
}

export function MusicPlayer({
  className,
  tracks = PLAYLIST,
  autoPlay = false,
  ...props
}: MusicPlayerProps) {
  const [trackList, setTrackList] = useState<Track[]>(tracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // Default placeholder duration for YouTube tracks
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Custom user inputs for YouTube adding
  const [customUrl, setCustomUrl] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const lastMessageRef = useRef<number>(0);

  const currentTrack = trackList[currentTrackIndex];

  // Extraction function for YouTube links
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Helper to send events to YouTube iframe
  const sendPlayerCommand = (command: string, args: any = "") => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: command,
          args: args
        }),
        "*"
      );
    }
  };

  // Sync state with audio / YouTube element
  useEffect(() => {
    setAudioError(null);
    setCurrentTime(0);
    // Use a default duration for YouTube tracks if we don't have metadata yet
    setDuration(currentTrack.youtubeId ? 180 : 0);

    if (currentTrack.youtubeId) {
      // Pause normal audio when YouTube is active
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Sync local audio element
      if (audioRef.current) {
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch((err) => {
            console.warn("Autoplay or source block:", err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrackIndex, currentTrack]);

  // Handle Play/Pause toggles
  useEffect(() => {
    if (currentTrack.youtubeId) {
      if (isPlaying) {
        sendPlayerCommand("playVideo");
      } else {
        sendPlayerCommand("pauseVideo");
      }
    } else {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.play().catch((err) => {
            console.error("Playback error:", err);
            setAudioError("Click to play or check network");
            setIsPlaying(false);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [isPlaying, currentTrackIndex]);

  // Sync Mute states
  useEffect(() => {
    if (currentTrack.youtubeId) {
      sendPlayerCommand(isMuted ? "mute" : "unmute");
    } else {
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
      }
    }
  }, [isMuted, currentTrackIndex]);

  // Sync Volume states
  useEffect(() => {
    if (currentTrack.youtubeId) {
      sendPlayerCommand("setVolume", volume * 100);
    } else {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }
  }, [volume, currentTrackIndex]);

  // YouTube timestamp postMessage listener
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === "onTimeDelivered") {
          setCurrentTime(data.info.currentTime);
          lastMessageRef.current = performance.now();
        }
        if (data.event === "infoDelivery" && data.info) {
          if (data.info.currentTime !== undefined) {
            setCurrentTime(data.info.currentTime);
            lastMessageRef.current = performance.now();
          }
          if (data.info.duration !== undefined) {
            setDuration(data.info.duration);
          }
        }
      } catch (err) {
        // Ignore non-JSON post messages
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Standard fallback interval for YouTube updates
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && currentTrack.youtubeId) {
      timer = setInterval(() => {
        if (performance.now() - lastMessageRef.current > 1500) {
          setCurrentTime((prev) => {
            if (duration > 0 && prev >= duration) {
              handleNext();
              return 0;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrackIndex, duration]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !currentTrack.youtubeId) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !currentTrack.youtubeId) {
      setDuration(audioRef.current.duration);
      setAudioError(null);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const togglePlay = () => {
    setAudioError(null);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setAudioError(null);
    setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setAudioError(null);
    setCurrentTrackIndex((prev) => (prev - 1 + trackList.length) % trackList.length);
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newPercentage = Math.max(0, Math.min(1, clickX / width));
      const newTime = newPercentage * duration;

      if (currentTrack.youtubeId) {
        sendPlayerCommand("seekTo", [newTime, true]);
        setCurrentTime(newTime);
      } else if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Add Custom song from YouTube URL dynamically
  const handleAddCustomSong = async () => {
    if (!customUrl.trim()) return;
    setAddError(null);

    let ytId = getYouTubeId(customUrl.trim());
    if (!ytId && customUrl.trim().length === 11) {
      ytId = customUrl.trim(); // Raw ID input
    }

    if (!ytId) {
      setAddError("Invalid YouTube Link or Video ID");
      return;
    }

    // Check if duplicate
    const duplicate = trackList.find((t) => t.youtubeId === ytId);
    if (duplicate) {
      const index = trackList.indexOf(duplicate);
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setCustomUrl("");
      return;
    }

    const placeholderTrack: Track = {
      title: "Custom Stream...",
      artist: "YouTube",
      src: "",
      youtubeId: ytId,
      coverArt: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80`
    };

    try {
      // Dynamic fetch metadata using YouTube oEmbed
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
      if (response.ok) {
        const metadata = await response.json();
        if (metadata && metadata.title) {
          placeholderTrack.title = metadata.title;
          placeholderTrack.artist = metadata.author_name || "YouTube Creator";
        }
      }
    } catch (err) {
      placeholderTrack.title = `YouTube Song (${ytId})`;
      placeholderTrack.artist = "Custom Stream";
    }

    const updatedList = [...trackList, placeholderTrack];
    setTrackList(updatedList);
    setCurrentTrackIndex(updatedList.length - 1);
    setIsPlaying(true);
    setCustomUrl("");
  };

  // Helper to format time
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={cn("relative flex flex-col items-center w-full max-w-sm", className)}
      {...props}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={(e) => {
          if (!currentTrack.youtubeId) {
            const err = audioRef.current?.error;
            console.error("Audio element error:", err);
            if (err) {
              setAudioError(`Stream error (Code ${err.code})`);
            } else {
              setAudioError("Stream unavailable");
            }
          }
        }}
        preload="auto"
      />

      {/* Main Vinyl Record Container */}
      <div
        className="relative cursor-pointer select-none h-60 w-60 md:h-72 md:w-72 group"
        onClick={togglePlay}
        title={isPlaying ? "Pause" : "Play"}
      >
        {/* Tonearm */}
        <motion.div
          className="absolute z-20 top-[-5%] right-[-10%] sm:top-[-8%] sm:right-[-15%] origin-top-right w-[60%] h-[15%] pointer-events-none"
          initial={{ rotate: 10 }}
          animate={{ rotate: isPlaying ? -20 : 10 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Tonearm base */}
          <div className="absolute top-0 right-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-400 dark:bg-zinc-600 shadow-md transform translate-x-1/2 -translate-y-1/2 border-4 border-zinc-200 dark:border-zinc-800 z-10" />
          {/* Tonearm stick & Needle */}
          <div className="absolute top-0 right-[10px] sm:right-[15px] w-[90%] h-2 md:h-3 bg-zinc-400 dark:bg-zinc-500 rounded-full origin-right -rotate-12 shadow-sm flex items-center justify-start">
            {/* Needle */}
            <div className="w-4 h-4 md:w-5 md:h-5 bg-zinc-800 dark:bg-zinc-300 rounded-full shadow-md transform -translate-x-1/2" />
          </div>
        </motion.div>

        {/* Record Disc */}
        <div
          className={cn(
            "relative w-full h-full rounded-full border-4 sm:border-8 border-black/15 dark:border-white/10 shadow-2xl overflow-hidden shadow-black/40 bg-zinc-950 transition-transform duration-300 group-hover:scale-102"
          )}
          style={{
            animation: "spin 5s linear infinite",
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        >
          {/* Album Cover Background */}
          {currentTrack.coverArt && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrackIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-cover bg-center transition-opacity"
                style={{ backgroundImage: `url(${currentTrack.coverArt})` }}
              />
            </AnimatePresence>
          )}

          {/* Grooves Overlay */}
          <div
            className="absolute inset-0 rounded-full border border-black/30"
            style={{
              background:
                "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.5) 21%, transparent 22%, transparent 35%, rgba(0,0,0,0.6) 36%, transparent 37%, transparent 50%, rgba(0,0,0,0.45) 51%, transparent 52%, transparent 65%, rgba(0,0,0,0.7) 66%, transparent 67%, transparent 80%, rgba(0,0,0,0.5) 81%, transparent 82%)",
            }}
          />

          {/* Glare effect */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.12) 100%)",
            }}
          />

          {/* Center Label Area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full bg-zinc-900 border border-zinc-700 shadow-inner flex items-center justify-center z-10">
            {/* Inner circle pin hole */}
            <div className="w-4 h-4 bg-zinc-100 dark:bg-zinc-600 rounded-full shadow-inner border border-black/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Info labels */}
      <div className="mt-6 text-center select-none w-full px-4">
        <h4 className="text-white text-base font-bold tracking-wider uppercase font-mono truncate flex items-center justify-center gap-1.5">
          {currentTrack.youtubeId && <Youtube className="w-4 h-4 text-red-500 shrink-0" />}
          <span className="truncate">{currentTrack.title}</span>
        </h4>
        <p className="text-[#A1A1AA] text-xs font-semibold tracking-widest uppercase mt-1 font-mono truncate">
          {currentTrack.artist}
        </p>
        {audioError && (
          <p className="text-rose-500 text-[10px] font-mono mt-2 font-bold bg-rose-500/10 px-2.5 py-1 rounded inline-block animate-pulse border border-rose-500/20">
            {audioError}
          </p>
        )}
      </div>

      {/* Scrubber Progress Bar */}
      <div className="w-full px-4 mt-6">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-1 w-full bg-zinc-800 rounded-full cursor-pointer relative group/progress flex items-center"
        >
          {/* Progress fill */}
          <div
            className="h-full bg-[#be123c] rounded-full transition-all duration-100 relative"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          >
            {/* Playhead handle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-md" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-500 font-bold">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Index */}
      <div className="flex items-center justify-between w-full px-6 mt-4">
        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Playback Controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={handlePrev}
            className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-white hover:bg-zinc-200 text-black rounded-full transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/20"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          <button
            onClick={handleNext}
            className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Next track"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Index badge */}
        <span className="text-[10px] font-mono font-bold text-[#e11d48] bg-[#be123c]/10 px-2 py-0.5 rounded">
          {currentTrackIndex + 1}/{trackList.length}
        </span>
      </div>

      {/* YouTube Video Screen Feed (Rendered only for Active YouTube Tracks) */}
      {currentTrack.youtubeId && (
        <div className="w-full px-4 mt-6">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-black group/screen">
            <iframe
              ref={iframeRef}
              id="yt-player"
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?enablejsapi=1&controls=1&mute=${isMuted ? 1 : 0}&autoplay=${isPlaying ? 1 : 0}`}
              title="YouTube Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full pointer-events-auto"
            />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#0c0d0e]/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex justify-between items-center opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/5">
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#e11d48]" /> STREAM FEED
              </span>
              <span className="text-[10px] font-mono text-[#e11d48] font-bold animate-pulse">
                ● LIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Song YouTube Adding Module */}
      <div className="w-full px-4 mt-6">
        <div className="bg-[#0c0d0e] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 shadow-inner">
          <label className="text-[10px] font-mono tracking-widest text-[#565961] font-bold uppercase flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#e11d48]" /> Add YouTube Song
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste link (e.g. youtube.com/watch?v=...)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-black/40 border border-white/[0.08] hover:border-white/[0.15] focus:border-[#e11d48]/40 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all font-sans"
            />
            <button
              onClick={handleAddCustomSong}
              className="px-3 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 active:scale-95"
            >
              Add
            </button>
          </div>
          {addError && (
            <span className="text-[10px] font-mono text-rose-500 font-bold">
              {addError}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
