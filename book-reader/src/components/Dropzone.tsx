"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { extractTextFromPDF } from "../utils/pdfTextExtractor";

interface DropzoneProps {
  onFileUploaded: (fileUrl: string) => void;
  onTextExtracted: (textByPage: { [key: number]: string }) => void;
}

function Dropzone({ onFileUploaded, onTextExtracted }: DropzoneProps) {
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isExtractingText, setIsExtractingText] = useState<boolean>(false); // New state for text extraction

  const onDrop = useCallback(
    async (acceptedFiles: Blob[]) => {
      setUploadSuccess(false);
      setUploadError(null);
      setUploadProgress(0);
      setIsExtractingText(false); // Reset extraction state

      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        setUploadError("Invalid file type: only PDF is accepted.");
        return;
      }

      // Create an object URL for viewing the PDF
      const fileUrl = URL.createObjectURL(file);
      onFileUploaded(fileUrl);
      setUploadProgress(100); // Indicate file processing is done

      try {
        setIsExtractingText(true); // Start extraction spinner
        const textByPage = await extractTextFromPDF(file as File);
        onTextExtracted(textByPage);
        setUploadSuccess(true);
      } catch (error) {
        console.error("Text extraction failed", error);
        setUploadError("Failed to extract text from PDF.");
      } finally {
        setIsExtractingText(false); // Stop extraction spinner
      }
    },
    [onFileUploaded, onTextExtracted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    maxSize: 52428800, // 50MB
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center
        w-full max-w-md p-6 m-4 border-2 border-dotted rounded-lg
        text-center cursor-pointer transition-colors
        ${isDragActive ? "border-green-500 bg-gray-800" : "border-lime-500 bg-black hover:bg-gray-900"}
      `}
    >
      <input {...getInputProps()} className="hidden" />
      <h2 className="text-white font-bold text-lg mb-2">
        {isDragActive ? "Drop the PDF here..." : "Upload a PDF for Speech Synthesis"}
      </h2>
      <p className="text-sm text-gray-200 mb-8">[ Only .PDF files up to 50MB are supported ]</p>
      <button
        type="button"
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-lime-600 text-white font-semibold hover:bg-lime-700 transition-colors"
      >
        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
          <CloudUploadIcon className="w-5 h-5" />
        </div>
        <span>Upload file</span>
      </button>

      {/* Show progress bar when file is being read */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full max-w-sm bg-gray-700 rounded mt-4">
          <div className="bg-lime-600 h-2 rounded" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {/* Show a spinner while text extraction is happening */}
      {isExtractingText && (
        <div className="mt-4 flex items-center space-x-2 text-lime-400">
          <div className="animate-spin h-5 w-5 border-4 border-l-transparent border-green-500 rounded-full"></div>
          <span>Extracting text...</span>
        </div>
      )}

      <p className={`mt-4 min-h-[1rem] ${uploadError ? "text-red-500" : "invisible"}`}>
        {uploadError || "\u00A0"}
      </p>

      {uploadSuccess && <p className="mt-2 text-green-500">File uploaded successfully!</p>}
    </div>
  );
}

export default Dropzone;
