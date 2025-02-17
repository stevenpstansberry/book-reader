"use client";

import React, { useState, useCallback } from "react";
import Dropzone from "../components/Dropzone";
import ProgressBar from "../components/ProgressBar";
import PDFViewer from "../components/PDFViewer";
import AudioControl from "../components/AudioControl";
import VoiceSettings from "../components/VoiceSettings";
import { fetchTextToSpeech } from "../api/API";
import { VOICES } from "@/components/VoiceSettings";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<{ [key: number]: string }>({});
  const [audioCache, setAudioCache] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [generatingAudio, setGeneratingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  const [selectedVoice, setSelectedVoice] = useState<string>(VOICES[0].value);
  const [speed, setSpeed] = useState<number>(1);
  const [temperature, setTemperature] = useState<number>(0.7);

  // Control the overlay for VoiceSettings
  const [showSettings, setShowSettings] = useState(false);
  const handleOpenSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);

  // Find the selected voice object for display
  const selectedVoiceObject =
    VOICES.find((voice) => voice.value === selectedVoice) || VOICES[0];

  const resetProcess = () => {
    setPdfUrl(null);
    setPdfText({});
    setAudioCache({});
    setAudioUrl(null);
    setCurrentPage(1);
    setPdfName(null);
    setUploading(false);
    setGeneratingAudio(false);
    setUploadProgress(0);
    setAudioProgress(0);
  };

  const simulateProgress = (
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    onComplete: () => void
  ) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onComplete();
      }
      setProgress(progress);
    }, 300);
  };

  const handleFileUpload = useCallback((fileUrl: string) => {
    setUploading(true);
    simulateProgress(setUploadProgress, () => {
      setPdfUrl(fileUrl);
      setPdfName(fileUrl.split("/").pop() || "Unknown PDF");
      setCurrentPage(1);
      setUploading(false);
    });
  }, []);

  const fetchAndCacheAudio = async (
    pageNumber: number,
    text: string
  ): Promise<string | null> => {
    if (audioCache[pageNumber]) {
      return audioCache[pageNumber];
    }
    try {
      const audioData = await fetchTextToSpeech(text, selectedVoice, speed, temperature);
      const blob = new Blob([audioData], { type: "audio/mp3" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Error generating TTS for page ${pageNumber}:`, error);
      return null;
    }
  };

  const handleTextExtracted = useCallback(
    async (textByPage: { [key: number]: string }) => {
      setPdfText(textByPage);
      setGeneratingAudio(true);
      setAudioProgress(0);

      const newAudioCache: { [key: number]: string } = { ...audioCache };
      const totalPages = Object.keys(textByPage).length;
      let processedPages = 0;

      for (const pageNumberStr in textByPage) {
        const pageNumber = Number(pageNumberStr);
        if (!newAudioCache[pageNumber]) {
          try {
            const audioUrl = await fetchAndCacheAudio(pageNumber, textByPage[pageNumber]);
            if (audioUrl) {
              newAudioCache[pageNumber] = audioUrl;
            }
          } catch (error) {
            console.error(`Error generating audio for page ${pageNumber}:`, error);
          }
        }
        processedPages++;
        setAudioProgress(Math.round((processedPages / totalPages) * 100));
      }

      setAudioCache(newAudioCache);
      setGeneratingAudio(false);

      if (newAudioCache[1]) {
        setAudioUrl(newAudioCache[1]);
      }
    },
    [audioCache, selectedVoice, speed, temperature]
  );

  return (
    <div className="relative flex flex-col min-h-screen p-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-8 text-center">
        My PDF TTS Reader
      </h1>

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
              <AudioControl
                audioUrl={audioUrl}
                currentPage={currentPage}
                onGenerateAudio={() =>
                  fetchAndCacheAudio(currentPage, pdfText[currentPage])
                }
              />
              <button
                onClick={resetProcess}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Upload Another PDF
              </button>
            </>
          )
        ) : (
          <>
            {/* 
              Instead of a box, we display "chips" or "badges" for each setting. 
              Use a flex container, and each setting is an inline-flex badge. 
            */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {/* Voice */}
              <div className="inline-flex items-center bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Voice: {selectedVoiceObject.name}
              </div>
              {/* Accent */}
              <div className="inline-flex items-center bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Accent: {selectedVoiceObject.accent}
              </div>
              {/* Language */}
              <div className="inline-flex items-center bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Language: {selectedVoiceObject.language}
              </div>
              {/* Speed */}
              <div className="inline-flex items-center bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Speed: {speed.toFixed(2)}
              </div>
              {/* Temperature */}
              <div className="inline-flex items-center bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Temperature: {temperature.toFixed(2)}
              </div>
            </div>

            <Dropzone onFileUploaded={handleFileUpload} onTextExtracted={handleTextExtracted} />
            <button
              onClick={handleOpenSettings}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-lime-600 text-white font-semibold hover:bg-lime-700 transition-colors mt-4"
            >
              Customize Your Voice Playback
            </button>
          </>
        )}
      </div>

      {/* Overlay for Voice Settings */}
      {showSettings && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseSettings}
        >
          <VoiceSettings
            selectedVoice={selectedVoice}
            onSelectVoice={setSelectedVoice}
            speed={speed}
            onSpeedChange={setSpeed}
            temperature={temperature}
            onTemperatureChange={setTemperature}
            onClose={handleCloseSettings}
          />
        </div>
      )}
    </div>
  );
}
