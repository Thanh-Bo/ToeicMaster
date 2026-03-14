"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw, Gauge } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  label?: string;
}

// A static array of heights (percentages) to simulate a waveform visual
const WAVEFORM_DATA = [
  30, 40, 50, 70, 90, 100, 90, 70, 50, 40, 30, 
  25, 45, 65, 85, 65, 45, 25, 
  35, 55, 75, 95, 75, 55, 35, 
  20, 40, 60, 80, 100, 80, 60, 40, 20, 
  40, 60, 80, 90, 80, 60, 40, 
  20, 30, 50, 70, 50, 30, 20
];

export default function AudioPlayer({
  src,
  label = "Audio",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`[AudioPlayer] Loading audio for ${label}:`, src);
  }, [src, label]);

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    let errorMsg = "Unknown error";
    switch (audio.error?.code) {
      case 1: errorMsg = "MEDIA_ERR_ABORTED"; break;
      case 2: errorMsg = "MEDIA_ERR_NETWORK"; break;
      case 3: errorMsg = "MEDIA_ERR_DECODE"; break;
      case 4: errorMsg = "MEDIA_ERR_SRC_NOT_SUPPORTED"; break;
    }
    console.error(`[AudioPlayer] Error loading audio for ${label} (${audio.error?.code}): ${errorMsg}`, src);
    setError(`Failed to load audio: ${errorMsg}`);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error(`[AudioPlayer] Play error for ${label}:`, err);
          setError(`Failed to play audio: ${err.message}`);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + seconds),
      );
    }
  };

  const handlePlaybackRateChange = () => {
    const rates = [1, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  
  return (
    <div className="w-full  bg-[#f5f5f5] dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
      {error && (
        <div className="mb-3 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-100 rounded text-sm">
          {error}
        </div>
      )}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
      />

      {/* First Row: Play + Waveform + Time */}
      <div className="flex items-center gap-4 mb-4">
        {/* Play Button */}
        <button
          onClick={handlePlayPause}
          className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-300 dark:border-gray-500 bg-white dark:bg-zinc-800 text-slate-700 dark:text-gray-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-1" />
          )}
        </button>

        {/* Waveform Slider Wrapper */}
        <div className="relative flex-1 h-10 flex items-center justify-between gap-[2px]">
          {/* Visual Waveform Bars */}
          {WAVEFORM_DATA.map((height, i) => {
            const percentPlayed = duration > 0 ? currentTime / duration : 0;
            const barPercent = i / WAVEFORM_DATA.length;
            const isActive = barPercent <= percentPlayed;

            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-colors duration-75 ${
                  isActive ? "bg-teal-400" : "bg-gray-200 dark:bg-zinc-700"
                }`}
                style={{ height: `${height}%`, maxWidth: "4px" }}
              />
            );
          })}

          {/* Invisible Interactive Slider */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Time Display */}
        <div className="text-sm font-medium font-mono text-slate-600 dark:text-gray-400 min-w-[100px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Second Row: Skip buttons & Speed */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-6">   
          <button
            onClick={() => handleSkip(-3)}
            className="text-sm text-slate-400 hover:text-slate-700 dark:text-gray-500 dark:hover:text-gray-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            3s
          </button>

          <button
            onClick={() => handleSkip(5)}
            className="text-sm text-slate-400 hover:text-slate-700 dark:text-gray-500 dark:hover:text-gray-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            5s
          </button>
        </div>

        {/* Speed Control */}
        <button
          onClick={handlePlaybackRateChange}
          className="text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Gauge className="w-4 h-4" />
          {playbackRate}x
        </button>
      </div>
    </div>
  );
}