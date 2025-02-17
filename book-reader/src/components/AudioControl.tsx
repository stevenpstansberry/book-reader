"use client";

import React, { useState, useRef } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Replay,
  FiberManualRecord,
  FastRewind,
  FastForward,
} from "@mui/icons-material";

interface AudioControlProps {
  audioUrl: string | null;
  currentPage: number; // Receive currentPage from Home.tsx
  onGenerateAudio?: () => void;
}

export default function AudioControl({ audioUrl, currentPage, onGenerateAudio }: AudioControlProps) {
  console.log("📄 Current Page in AudioControl:", currentPage);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to the audio element

  console.log("🎵 AudioControl Loaded:");
  console.log("📄 Current Page:", currentPage);
  console.log("🔊 Audio URL:", audioUrl);
  console.log("📢 onGenerateAudio Function Exists?", !!onGenerateAudio);

  // Play/Pause control
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Rewind (go back 5 seconds)
  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  // Fast Forward (skip ahead 5 seconds)
  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
    }
  };

  // Skip Previous (restart audio)
  const handleSkipPrevious = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Skip Next (generate next page audio)
  const handleSkipNext = () => {
  };


  return (
    <div className="flex items-center justify-center p-2 rounded-full border shadow-md bg-darkPrimary">
      {/* Repeat Button */}
      <Tooltip title="Repeat">
        <IconButton className="text-lightPrimary" onClick={handleSkipPrevious}>
          <Replay />
        </IconButton>
      </Tooltip>

      {/* Rewind Button */}
      <Tooltip title="Rewind">
        <IconButton className="text-lightPrimary" onClick={handleRewind}>
          <FastRewind />
        </IconButton>
      </Tooltip>

      {/* Skip Previous */}
      <Tooltip title="Previous">
        <IconButton className="text-lightPrimary" onClick={handleSkipPrevious}>
          <SkipPrevious />
        </IconButton>
      </Tooltip>

      {/* Play/Pause Button */}
      <div className="mx-2 p-2 rounded-full bg-darkPrimary border border-lightPrimary shadow-lg">
        <Tooltip title={isPlaying ? "Pause" : "Play"}>
          <IconButton onClick={handlePlayPause} className="text-lightPrimary">
            {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
          </IconButton>
        </Tooltip>
      </div>

      {/* Skip Next */}
      <Tooltip title="Next">
        <IconButton className="text-lightPrimary" onClick={handleSkipNext}>
          <SkipNext />
        </IconButton>
      </Tooltip>

      {/* Fast Forward Button */}
      <Tooltip title="Fast Forward">
        <IconButton className="text-lightPrimary" onClick={handleFastForward}>
          <FastForward />
        </IconButton>
      </Tooltip>

      {/* Record Button (Placeholder for future use) */}
      <Tooltip title="Record">
        <IconButton className="text-lightPrimary">
          <FiberManualRecord />
        </IconButton>
      </Tooltip>

      {/* Audio Player */}
      {audioUrl && (
        <audio
          ref={audioRef} // Attach ref to control the audio
          src={audioUrl}
          className="ml-4"
          onEnded={() => setIsPlaying(false)}
        />
      )}

    </div>
  );
}
