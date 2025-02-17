"use client";

import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "../components/Dropzone";
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

  // Handle file upload
  const handleFileUpload = useCallback((fileUrl: string) => {
    setUploading(true);
    setUploadProgress(50); // Simulating some progress
    setTimeout(() => {
      setPdfUrl(fileUrl);
      setPdfName(fileUrl.split("/").pop() || "Unknown PDF");
      setCurrentPage(1);
      setUploadProgress(100);
      setTimeout(() => setUploading(false), 500);
    }, 1500);
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
        <div className="flex flex-col items-center p-6 bg-gray-200 rounded-lg shadow-lg">
          <p className="text-lg font-semibold mb-2">Uploading PDF...</p>
          <p className="text-blue-600 font-bold">{uploadProgress}% Uploaded</p>
          <div className="w-64 bg-gray-300 h-4 rounded-full mt-2">
            <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      ) : pdfUrl ? (
        generatingAudio ? (
          <div className="flex flex-col items-center p-6 bg-gray-200 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-2">{pdfName}</p>
            <p className="text-blue-600 font-bold">{audioProgress}% Audio Processed</p>
            <div className="w-64 bg-gray-300 h-4 rounded-full mt-2">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${audioProgress}%` }}></div>
            </div>
          </div>
        ) : (
          <>
            <PDFViewer fileUrl={pdfUrl} onPageChange={setCurrentPage} />
            <AudioControl audioUrl={audioUrl} currentPage={currentPage} onGenerateAudio={() => generateAndCacheAudio(currentPage, pdfText[currentPage])} />
            <button
              onClick={() => {
                setPdfUrl(null);
                setPdfText({});
                setAudioCache({});
                setAudioUrl(null);
                setCurrentPage(1);
                setPdfName(null);
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
