"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  FastRewind,
  FastForward,
  VolumeUp,
} from "@mui/icons-material";

interface AudioControlProps {
  audioCache: { [page: number]: string }; // entire cache
  currentPage: number;
}

export default function AudioControl({ audioCache, currentPage }: AudioControlProps) {
  // Page/Audio State
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const [loadedAudioUrl, setLoadedAudioUrl] = useState<string | null>(null);

  // Playback & Volume State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // 0.0 -> 1.0

  // Progress State (in seconds)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop old audio when loadedAudioUrl changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [loadedAudioUrl]);

  // Sync the volume state -> audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Attach timeupdate for progress
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleTimeUpdate = () => setCurrentTime(audioEl.currentTime);
    const handleLoadedData = () => setDuration(audioEl.duration);

    audioEl.addEventListener("timeupdate", handleTimeUpdate);
    audioEl.addEventListener("loadedmetadata", handleLoadedData);

    return () => {
      audioEl.removeEventListener("timeupdate", handleTimeUpdate);
      audioEl.removeEventListener("loadedmetadata", handleLoadedData);
    };
  }, []);

  // Auto-play once loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Play/Pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!loadedAudioUrl) {
        const pageToLoad = loadedPage ?? currentPage;
        const pageAudio = audioCache[pageToLoad];
        if (!pageAudio) {
          console.warn("No audio in cache for page:", pageToLoad);
          return;
        }
        setLoadedPage(pageToLoad);
        setLoadedAudioUrl(pageAudio);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Force load the current PDF page's audio
  const handleSkipNext = () => {
    if (!audioRef.current) return;
    const pageAudio = audioCache[currentPage];
    if (!pageAudio) {
      console.warn("No audio in cache for page:", currentPage);
      return;
    }
    setLoadedPage(currentPage);
    setLoadedAudioUrl(pageAudio);
  };

  // Rewind 5s
  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  // Fast forward 5s
  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    }
  };

  // Restart from beginning
  const handleSkipPrevious = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  // Audio progress bar (seek)
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Controls Container  */}
      <div
        className="
          flex items-center justify-center
          px-4 py-3
          rounded-lg shadow-md
          bg-[#2B2B2B] text-gray-100
          space-x-3
        "
      >
        {/* Play/Pause */}
        <div className="p-1 rounded-full bg-[#404040] border border-gray-200 shadow-lg">
          <Tooltip title={isPlaying ? "Pause" : "Play"}>
            <IconButton onClick={handlePlayPause} className="text-gray-100">
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
        </div>

        {/* Volume Container */}
        <div
          className="
            flex items-center
            relative
            h-10
            w-[200px]
            rounded-md
            px-2
            group
          "
        >
          <Tooltip title={`Volume: ${(volume * 100).toFixed(0)}%`}>
            <VolumeUp fontSize="small" className="mr-2" style={{ color: 'black' }} />
          </Tooltip>

          {/* volume slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="
              w-24 h-0.5 accent-lime-400
              opacity-0 group-hover:opacity-100
              pointer-events-none group-hover:pointer-events-auto
              transition-opacity duration-200
              flex-shrink-0
            "
          />
        </div>

        {/* Buffer space */}
        <div className="flex-grow"></div>

        {/* Rewind */}
        <Tooltip title="Rewind 5s">
          <IconButton onClick={handleRewind} className="text-gray-100">
            <FastRewind />
          </IconButton>
        </Tooltip>

        {/* Skip Previous (restart) */}
        <Tooltip title="Restart Audio">
          <IconButton onClick={handleSkipPrevious} className="text-gray-100">
            <SkipPrevious />
          </IconButton>
        </Tooltip>

        {/* Skip Next (override) */}
        <Tooltip title="Override to Current Page Audio">
          <IconButton onClick={handleSkipNext} className="text-gray-100">
            <SkipNext />
          </IconButton>
        </Tooltip>

        {/* Fast Forward */}
        <Tooltip title="Fast Forward 5s">
          <IconButton onClick={handleFastForward} className="text-gray-100">
            <FastForward />
          </IconButton>
        </Tooltip>
      </div>

      {/* Progress Bar + Time */}
      <div className="mt-3 w-full max-w-lg flex flex-col items-center">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full accent-lime-500"
        />

        <div className="text-sm text-gray-200 mt-1 flex justify-between w-full">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={loadedAudioUrl || undefined}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
}

/** 
 * Helper to format seconds -> MM:SS 
 */
function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const mm = mins < 10 ? `0${mins}` : mins;
  const ss = secs < 10 ? `0${secs}` : secs;
  return `${mm}:${ss}`;
}