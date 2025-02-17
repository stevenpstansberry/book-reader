"use client";

import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "../components/Dropzone";
import ProgressBar from "../components/ProgressBar";
import PDFViewer from "../components/PDFViewer";
import AudioControl from "../components/AudioControl";
import { fetchTextToSpeech } from "../api/API";

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

  // Incremental progress function
  const simulateProgress = (setProgress: React.Dispatch<React.SetStateAction<number>>, onComplete: () => void) => {
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

  // Handle file upload
  const handleFileUpload = useCallback((fileUrl: string) => {
    setUploading(true);
    simulateProgress(setUploadProgress, () => {
      setPdfUrl(fileUrl);
      setPdfName(fileUrl.split("/").pop() || "Unknown PDF");
      setCurrentPage(1);
      setUploading(false);
    });
  }, []);

  // Handle text extraction and generate audio for all pages
  const handleTextExtracted = useCallback(async (textByPage: { [key: number]: string }) => {
    setPdfText(textByPage);
    setGeneratingAudio(true);
    setAudioProgress(0);

    const newAudioCache: { [key: number]: string } = { ...audioCache };
    const totalPages = Object.keys(textByPage).length;
    let processedPages = 0;

    for (const pageNumber in textByPage) {
      const pageNum = Number(pageNumber);
      if (!newAudioCache[pageNum]) {
        try {
          const audioUrl = await generateAndCacheAudio(pageNum, textByPage[pageNum]);
          if (audioUrl) {
            newAudioCache[pageNum] = audioUrl;
          }
        } catch (error) {
          console.error(`❌ Error generating audio for page ${pageNum}:`, error);
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
  }, []);

  const generateAndCacheAudio = async (pageNumber: number, text: string): Promise<string | null> => {
    if (audioCache[pageNumber]) {
      return audioCache[pageNumber];
    }
    try {
      const voice = "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json";
      const audioData = await fetchTextToSpeech(text, voice);
      const blob = new Blob([audioData], { type: "audio/mp3" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`❌ Error generating TTS for page ${pageNumber}:`, error);
      return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {uploading ? (
        <ProgressBar label="Uploading PDF..." progress={uploadProgress} onCancel={resetProcess} />
      ) : pdfUrl ? (
        generatingAudio ? (
          <ProgressBar label={`Generating Audio`} progress={audioProgress} onCancel={resetProcess}/>
        ) : (
          <>
            <PDFViewer fileUrl={pdfUrl} onPageChange={setCurrentPage} />
            <AudioControl audioUrl={audioUrl} currentPage={currentPage} onGenerateAudio={() => generateAndCacheAudio(currentPage, pdfText[currentPage])} />
            <button
              onClick={() => {
                resetProcess()
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Upload Another PDF
            </button>
          </>
        )
      ) : (
        <Dropzone onFileUploaded={handleFileUpload} onTextExtracted={handleTextExtracted} />
      )}
    </div>
  );
}