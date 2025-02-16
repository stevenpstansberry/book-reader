"use client";

import React, { useState, useCallback } from "react";
import Dropzone from "../components/Dropzone";
import PDFViewer from "../components/PDFViewer";
import AudioControl from "../components/AudioControl";

export default function Home() {

  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<{ [key: number]: string }>({});
  console.log(pdfText)

  const handleFileUpload = useCallback((fileUrl: string) => {
    setPdfUrl(fileUrl);
  }, []);

  const handleTextExtracted = useCallback((textByPage: { [key: number]: string }) => {
    setPdfText(textByPage);
  }, []);

  const handleClear = () => {
    setPdfUrl(null);
    setPdfText({});
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {pdfUrl ? (
        <>
          <PDFViewer fileUrl={pdfUrl} />
          <AudioControl />
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
