"use client";

import React from "react";

interface ProgressBarProps {
  label: string;
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, progress }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <p className="text-lg font-semibold mb-2">{label}</p>
      <div className="w-64 bg-gray-600 h-4 rounded-full relative overflow-hidden mt-2">
        <div
          className="bg-green-500 h-full rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 animate-spin border-4 border-gray-400 border-t-green-500 rounded-full w-6 h-6"></div>
      <p className="text-green-400 font-bold mt-2">{progress}%</p>
    </div>
  );
};

export default ProgressBar;
