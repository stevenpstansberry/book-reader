"use client";

import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import PDFToolbar from "./PDFToolbar";

interface PDFViewerProps {
  fileUrl: string;
  onPageChange: (page: number) => void;
}

function PDFViewer({ fileUrl, onPageChange }: PDFViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
      <PDFToolbar Toolbar={Toolbar} onPageChange={onPageChange} />
    ),
  });

  return (
    <div className="w-full max-w-3xl">
      <div style={{ height: "750px" }}>
        <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            onPageChange={(e) => onPageChange(e.currentPage + 1)}
            transformGetDocumentParams={(options) =>
              Object.assign({}, options, {
                cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
                cMapPacked: true,
              })
            }
          />
        </Worker>
      </div>
    </div>
  );
}

export default PDFViewer;
