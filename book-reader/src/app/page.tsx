"use client";

import React, { useState, useCallback, useRef } from "react";
import Dropzone from "../components/Dropzone";
import ProgressBar from "../components/ProgressBar";
import PDFViewer from "../components/PDFViewer";
import AudioControl from "../components/AudioControl";
import VoiceSettings from "../components/VoiceSettings";
import { VOICES } from "@/components/VoiceSettings";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
  handleTextExtracted as handleTextExtractedUtil
} from "../utils/audioUtilities";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [generatingAudio, setGeneratingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  const [selectedVoice, setSelectedVoice] = useState<string>(VOICES[0].value);
  const [speed, setSpeed] = useState<number>(1);
  const [temperature, setTemperature] = useState<number>(0.7);


  // Cancel ref for any ongoing operations
  const cancelRef = useRef(false);

  // -------------------------------
  // RESET / CANCEL LOGIC
  // -------------------------------
  const resetProcess = () => {
    cancelRef.current = true; // stop any in-progress operations
    setPdfUrl(null);
    setAudioCache({});
    setCurrentPage(1);
    setUploading(false);
    setGeneratingAudio(false);
    setUploadProgress(0);
    setAudioProgress(0);
  };

  // -------------------------------
  // PROGRESS SIMULATION (for PDF upload)
  // -------------------------------
  const simulateProgress = (
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    onComplete: () => void
  ) => {
    let progress = 0;
    cancelRef.current = false; // reset cancellation on new start
    const interval = setInterval(() => {
      if (cancelRef.current) {
        clearInterval(interval);
        return;
      }
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onComplete();
      }
      setProgress(progress);
    }, 300);
  };

  // -------------------------------
  // PDF FILE UPLOAD
  // -------------------------------
  const handleFileUpload = useCallback(
    (fileUrl: string) => {
      resetProcess();
      setUploading(true);
      simulateProgress(setUploadProgress, () => {
        if (!cancelRef.current) {
          setPdfUrl(fileUrl);
          setCurrentPage(1);
          setUploading(false);
        }
      });
    },
    [resetProcess]
  );

  // -------------------------------
  // TEXT EXTRACTION -> AUDIO TTS
  // -------------------------------
  const handleTextExtracted = useCallback(
    async (textByPage: { [key: number]: string }) => {
      await handleTextExtractedUtil(
        Object.values(textByPage),
        cancelRef,
        setGeneratingAudio,
        setAudioProgress,
        audioCache,
        setAudioCache,
        selectedVoice,
        speed,
        temperature
      );
    },
    [audioCache, selectedVoice, speed, temperature]
  );

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="relative flex flex-col min-h-screen p-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-8 text-center">
        Voice Reader for PDFs
      </h1>
      <h2 className="text-4xl font-bold text-lime-600 mb-8 text-center">
        Powered by PlayAI
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center">
        {uploading ? (
          <ProgressBar
            label="Uploading PDF..."
            progress={uploadProgress}
            onCancel={resetProcess}
          />
        ) : pdfUrl ? (
          generatingAudio ? (
            <ProgressBar
              label="Generating Audio..."
              progress={audioProgress}
              onCancel={resetProcess}
            />
          ) : (
            <>
              <PDFViewer fileUrl={pdfUrl} onPageChange={setCurrentPage} />
              <div className="mt-4">
                <AudioControl audioCache={audioCache} currentPage={currentPage} />
              </div>
              <button
                onClick={resetProcess}
                className="mt-4 px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg
                           hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg
                           active:scale-95 flex items-center space-x-2"
              >
                <CloudUploadIcon className="w-5 h-5" />
                <span>Upload Another PDF</span>
              </button>
            </>
          )
        ) : (
          <>
            <VoiceSettings
            selectedVoice={selectedVoice}
            onSelectVoice={setSelectedVoice}
            speed={speed}
            onSpeedChange={setSpeed}
            temperature={temperature}
            onTemperatureChange={setTemperature}
            />
            <Dropzone
              onFileUploaded={handleFileUpload}
              onTextExtracted={handleTextExtracted}
            />
          </>
        )}
      </div>
    </div>
  );
}
