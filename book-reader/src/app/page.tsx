"use client";

import React, { useState, useCallback } from "react";
import Dropzone from "../components/Dropzone";
import PDFViewer from "../components/PDFViewer";
import AudioControl from "../components/AudioControl";
import { fetchTextToSpeech } from "../api/API";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<{ [key: number]: string }>({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Store the current page

  console.log("📄 Extracted PDF Text by Page:", pdfText);
  console.log("🔊 Current Audio URL:", audioUrl);
  console.log("📑 Current Page:", currentPage);

  const handleFileUpload = useCallback((fileUrl: string) => {
    console.log("📂 PDF Uploaded:", fileUrl);
    setPdfUrl(fileUrl);
  }, []);

  const handleTextExtracted = useCallback((textByPage: { [key: number]: string }) => {
    console.log("📑 Extracted Text from PDF:", textByPage);
    setPdfText(textByPage);
  }, []);

  const handleGenerateAudio = async () => {
    console.log(`🎙️ Generating Audio for Page: ${currentPage}`);
    if (!pdfText[currentPage]) {
      console.warn(`⚠️ No text found for page ${currentPage}`);
      return;
    }

    try {
      const voice = "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json";
      const audioData = await fetchTextToSpeech(pdfText[currentPage], voice);
      const blob = new Blob([audioData], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(blob);
      
      console.log("✅ Audio successfully generated:", audioUrl);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("❌ Error generating TTS:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    console.log(`📄 Page changed to: ${newPage}`);
    setCurrentPage(newPage);
  };

  const handleClear = () => {
    console.log("🗑️ Clearing PDF and audio data...");
    setPdfUrl(null);
    setPdfText({});
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
