"use client";

import React, { ReactElement } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
    fileUrl: string;
    onPageChange: (page: number) => void; // Callback to notify Home.tsx of page change
  }

const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement, onPageChange: (page: number) => void) => (
    <Toolbar>
        {(slots: ToolbarSlot) => {
            const {
                CurrentPageInput,
                CurrentScale,
                GoToNextPage,
                GoToPreviousPage,
                NumberOfPages,
                ZoomIn,
                ZoomOut,
            } = slots;
            return (
                <div className="flex items-center">
                    <div className="px-1">
                        <ZoomOut>
                            {(props) => (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    onClick={props.onClick}
                                >
                                    Zoom out
                                </button>
                            )}
                        </ZoomOut>
                    </div>
                    <div className="px-1">
                        <CurrentScale>
                            {(props) => <span>{`${Math.round(props.scale * 100)}%`}</span>}
                        </CurrentScale>
                    </div>
                    <div className="px-1">
                        <ZoomIn>
                            {(props) => (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    onClick={props.onClick}
                                >
                                    Zoom in
                                </button>
                            )}
                        </ZoomIn>
                    </div>
                    <div className="px-1 ml-auto">
                        <GoToPreviousPage>
                            {(props) => (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    disabled={props.isDisabled}
                                    onClick={props.onClick}
                                >
                                    Previous page
                                </button>
                            )}
                        </GoToPreviousPage>
                    </div>
                    <div className="px-1 w-16">
                        <CurrentPageInput />
                    </div>
                    <div className="px-1">
                        / <NumberOfPages />
                    </div>
                    <div className="px-1">
                        <GoToNextPage>
                            {(props) => (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    disabled={props.isDisabled}
                                    onClick={props.onClick}
                                >
                                    Next page
                                </button>
                            )}
                        </GoToNextPage>
                    </div>
                </div>
            );
        }}
    </Toolbar>
);



function PDFViewer({ fileUrl, onPageChange }: PDFViewerProps) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
      sidebarTabs: () => [],
      renderToolbar: (Toolbar) => renderToolbar(Toolbar, onPageChange),
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
