"use client";

import React, { ReactElement } from "react";
import {
  ToolbarProps,
  ToolbarSlot,
} from "@react-pdf-viewer/default-layout";

interface PDFToolbarProps {
  Toolbar: (props: ToolbarProps) => ReactElement;
  onPageChange: (page: number) => void;
}

export default function PDFToolbar({ Toolbar, onPageChange }: PDFToolbarProps) {
  return (
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
          <div className="flex items-center bg-[#2B2B2B] text-gray-100 px-4 py-2">
            {/* Zoom Out button */}
            <div className="mr-2">
              <ZoomOut>
                {(props) => (
                  <button
                    onClick={props.onClick}
                    className="bg-[#1F1F1F] text-[#E0E0E0] hover:bg-[#3A3A3A]
                               px-3 py-2 rounded 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors"
                  >
                    Zoom out
                  </button>
                )}
              </ZoomOut>
            </div>

            {/* Current Scale */}
            <div className="mx-2">
              <CurrentScale>
                {(props) => (
                  <span className="font-semibold text-[#E0E0E0]">
                    {`${Math.round(props.scale * 100)}%`}
                  </span>
                )}
              </CurrentScale>
            </div>

            {/* Zoom In button */}
            <div className="mr-auto ml-2">
              <ZoomIn>
                {(props) => (
                  <button
                    onClick={props.onClick}
                    className="bg-[#1F1F1F] text-[#E0E0E0] hover:bg-[#3A3A3A]
                               px-3 py-2 rounded 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors"
                  >
                    Zoom in
                  </button>
                )}
              </ZoomIn>
            </div>

            {/* Previous Page button */}
            <div className="mr-2">
              <GoToPreviousPage>
                {(props) => (
                  <button
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                    className="bg-[#1F1F1F] text-[#E0E0E0] hover:bg-[#3A3A3A]
                               px-3 py-2 rounded
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors"
                  >
                    Previous page
                  </button>
                )}
              </GoToPreviousPage>
            </div>

            {/* Current Page Input */}
            <div className="mr-2">
              <CurrentPageInput/>
            </div>

            {/* Total Number of Pages */}
            <div className="mr-2 text-[#E0E0E0]" >
              / <NumberOfPages />
            </div>

            {/* Next Page button */}
            <div>
              <GoToNextPage>
                {(props) => (
                  <button
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                    className="bg-[#1F1F1F] text-[#E0E0E0] hover:bg-[#3A3A3A]
                               px-3 py-2 rounded 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors"
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
}
