"use client";

import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "../components/Dropzone";
import PDFViewer from "../components/PDFViewer";
import AudioControl from "../components/AudioControl";
import { fetchTextToSpeech } from "../api/API";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<{ [key: number]: string }>({});
  const [audioCache, setAudioCache] = useState<{ [key: number]: string }>({}); // Store generated audio
  const [currentPage, setCurrentPage] = useState<number>(1); // Store the current page
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Current audio playing

  console.log("📄 Extracted PDF Text by Page:", pdfText);
  console.log("🔊 Cached Audio:", audioCache);
  console.log("📑 Current Page:", currentPage);

  // Handle file upload
  const handleFileUpload = useCallback((fileUrl: string) => {
    console.log("📂 PDF Uploaded:", fileUrl);
    setPdfUrl(fileUrl);
    setCurrentPage(1); // Reset to page 1
  }, []);

  // Handle text extraction and auto-generate audio for page 1
  const handleTextExtracted = useCallback((textByPage: { [key: number]: string }) => {
    console.log("📑 Extracted Text from PDF:", textByPage);
    setPdfText(textByPage);

    // Auto-generate audio for page 1
    if (textByPage[1]) {
      generateAndCacheAudio(1, textByPage[1]);
    }
  }, []);

  // Function to generate audio and store it in the cache
  const generateAndCacheAudio = async (pageNumber: number, text: string) => {
    if (audioCache[pageNumber]) {
      console.log(`🔊 Audio already exists for page ${pageNumber}, using cache.`);
      setAudioUrl(audioCache[pageNumber]);
      return;
    }

    console.log(`🎙️ Generating Audio for Page: ${pageNumber}`);
    try {
      const voice = "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json";
      const audioData = await fetchTextToSpeech(text, voice);
      const blob = new Blob([audioData], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(blob);

      console.log("✅ Audio successfully generated:", audioUrl);
      setAudioCache((prevCache) => ({
        ...prevCache,
        [pageNumber]: audioUrl, // Cache the audio file
      }));
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("❌ Error generating TTS:", error);
    }
  };

  // Handle manual audio generation (used in AudioControl)
  const handleGenerateAudio = async () => {
    console.log(`🎙️ Checking audio for page ${currentPage}`);
    if (pdfText[currentPage]) {
      generateAndCacheAudio(currentPage, pdfText[currentPage]);
    } else {
      console.warn(`⚠️ No text found for page ${currentPage}`);
    }
  };

  // Update audio when the page changes
  useEffect(() => {
    if (audioCache[currentPage]) {
      setAudioUrl(audioCache[currentPage]);
    }
  }, [currentPage, audioCache]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    console.log(`📄 Page changed to: ${newPage}`);
    setCurrentPage(newPage);
  };

  // Clear function
  const handleClear = () => {
    console.log("🗑️ Clearing PDF and audio data...");
    setPdfUrl(null);
    setPdfText({});
    setAudioCache({});
    setAudioUrl(null);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {pdfUrl ? (
        <>
          <PDFViewer fileUrl={pdfUrl} onPageChange={handlePageChange} />
          <AudioControl 
            audioUrl={audioUrl} 
            currentPage={currentPage} 
            onGenerateAudio={handleGenerateAudio} 
          />
          <button
            onClick={handleClear}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Upload Another PDF
          </button>
        </>
      ) : (
        <Dropzone onFileUploaded={handleFileUpload} onTextExtracted={handleTextExtracted} />
      )}
    </div>
  );
}
