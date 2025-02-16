"use client";

import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Replay,
  People,
  FiberManualRecord,
  FastRewind,
  FastForward,
} from "@mui/icons-material";

export default function AudioControl() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center p-2 rounded-full border shadow-md bg-darkPrimary">
      {/* Repeat Button */}
      <Tooltip title="Repeat" slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
        <IconButton className="text-lightPrimary">
          <Replay />
        </IconButton>
      </Tooltip>

      {/* Rewind Button */}
      <Tooltip title="Rewind" slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
        <IconButton className="text-lightPrimary">
          <FastRewind />
        </IconButton>
      </Tooltip>

      {/* Skip Previous */}
      <Tooltip title="Previous" slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
        <IconButton className="text-lightPrimary">
          <SkipPrevious />
        </IconButton>
      </Tooltip>

      {/* Play/Pause Button */}
      <div className="mx-2 p-2 rounded-full bg-darkPrimary border border-lightPrimary shadow-lg">
        <Tooltip title={isPlaying ? "Pause" : "Play"} slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
          <IconButton onClick={handlePlayPause} className="text-lightPrimary">
            {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
          </IconButton>
        </Tooltip>
      </div>

      {/* Skip Next */}
      <Tooltip title="Next" slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
        <IconButton className="text-lightPrimary">
          <SkipNext />
        </IconButton>
      </Tooltip>

      {/* Fast Forward Button */}
      <Tooltip title="Fast Forward" slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
        <IconButton className="text-lightPrimary">
          <FastForward />
        </IconButton>
      </Tooltip>

      {/* Record Button */}
      <Tooltip title="Record" slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
        <IconButton className="text-lightPrimary">
          <FiberManualRecord />
        </IconButton>
      </Tooltip>

      {/* People/Group Button */}
      <Tooltip title="Participants" slotProps={{ tooltip: { className: "MuiTooltip-tooltip" } }}>
        <IconButton className="text-lightPrimary">
          <People />
        </IconButton>
      </Tooltip>
    </div>
  );
}