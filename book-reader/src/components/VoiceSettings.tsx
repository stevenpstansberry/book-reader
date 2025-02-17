import React, { useState, useEffect } from "react";
// Material UI icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface VoiceSettingsProps {
  selectedVoice: string;
  onSelectVoice: (voice: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  onClose?: () => void;
}

export const VOICES = [
  {
    name: "Angelo",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value:
      "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json",
    sample:
      "https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Angelo_Sample.wav",
    gender: "male",
    style: "Conversational",
  },
  {
    name: "Deedee",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value:
      "s3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/original/manifest.json",
    sample:
      "https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Deedee_Sample.wav",
    gender: "female",
    style: "Conversational",
  },
  {
    name: "Jennifer",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value:
      "s3://voice-cloning-zero-shot/801a663f-efd0-4254-98d0-5c175514c3e8/jennifer/manifest.json",
    sample:
      "https://peregrine-samples.s3.amazonaws.com/parrot-samples/jennifer.wav",
    gender: "female",
    style: "Conversational",
  },
  {
    name: "Briggs",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value:
      "s3://voice-cloning-zero-shot/71cdb799-1e03-41c6-8a05-f7cd55134b0b/original/manifest.json",
    sample:
      "https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Briggs_Sample.wav",
    gender: "male",
    style: "Narrative",
  },
  {
    name: "Samara",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value:
      "s3://voice-cloning-zero-shot/90217770-a480-4a91-b1ea-df00f4d4c29d/original/manifest.json",
    sample:
      "https://parrot-samples.s3.amazonaws.com/gargamel/Samara.wav",
    gender: "female",
    style: "Conversational",
  },
];

// Button style for voice settings
const buttonClasses = `
  px-4 py-2
  bg-lime-600 hover:bg-lime-700
  text-white font-medium
  rounded
  transition-colors duration-200
  inline-flex items-center justify-center
`;

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  selectedVoice,
  onSelectVoice,
  speed,
  onSpeedChange,
  temperature,
  onTemperatureChange,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const foundIndex = VOICES.findIndex((voice) => voice.value === selectedVoice);
    if (foundIndex >= 0) {
      setCurrentIndex(foundIndex);
    }
  }, [selectedVoice]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? VOICES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === VOICES.length - 1 ? 0 : prev + 1));
  };

  const currentVoice = VOICES[currentIndex];

  return (
    <div
      className="
        relative w-full max-w-xl mx-auto 
        p-6 mt-4 
        rounded-md 
        bg-gray-900 text-gray-100
        shadow-lg
      "
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-xl font-bold mb-3 text-center">Select a Voice</h2>

      {/* Voice name / style / accent / language */}
      <div className="text-center mb-4">
        <span className="block text-2xl font-bold">{currentVoice.name}</span>
        <span className="block text-sm text-gray-400 mt-1">
          Style: <span className="font-medium">{currentVoice.style}</span> |{" "}
          Accent: <span className="font-medium">{currentVoice.accent}</span> |{" "}
          Language: <span className="font-medium">{currentVoice.language}</span>
        </span>
      </div>

      {/* Audio preview */}
      <style>
        {`
          /* Dark mode styles for the native audio controls */
          .dark-audio::-webkit-media-controls-panel {
            background-color: #333 !important;
            border: none !important; 
          }
          .dark-audio::-webkit-media-controls-play-button,
          .dark-audio::-webkit-media-controls-pause-button,
          .dark-audio::-webkit-media-controls-mute-button,
          .dark-audio::-webkit-media-controls-volume-slider,
          .dark-audio::-webkit-media-controls-seek-back-button,
          .dark-audio::-webkit-media-controls-seek-forward-button,
          .dark-audio::-webkit-media-controls-current-time-display,
          .dark-audio::-webkit-media-controls-time-remaining-display {
            filter: invert(100%);
          }
        `}
      </style>
      <div className="flex justify-center mb-4">
        <audio className="dark-audio" src={currentVoice.sample} controls />
      </div>

      {/* Voice description */}
      <div className="text-sm text-center mb-5 px-4">
        <strong>Brief Description:</strong> {currentVoice.name} is a{" "}
        {currentVoice.gender} voice with a{" "}
        {currentVoice.style.toLowerCase()} style, perfect for{" "}
        {currentVoice.language} narration.
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center items-center space-x-4 mb-5 ">
        <button onClick={handlePrev} className={buttonClasses}>
          <KeyboardArrowLeftIcon fontSize="small" className="mr-1" />
          Prev
        </button>
        <button onClick={handleNext} className={buttonClasses} >
          Next
          <KeyboardArrowRightIcon fontSize="small" className="ml-1" />
        </button>
      </div>

      {/* Sliders */}
      <div className="mx-auto mb-4 text-left w-full max-w-sm">
        <label className="block mb-1 font-semibold">
          Speed: {speed.toFixed(2)}
        </label>
        <input
          className="w-full cursor-pointer"
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        />
      </div>
      <div className="mx-auto mb-5 text-left w-full max-w-sm">
        <label className="block mb-1 font-semibold">
          Temperature: {temperature.toFixed(2)}
        </label>
        <input
          className="w-full cursor-pointer"
          type="range"
          min={0.0}
          max={1.0}
          step={0.1}
          value={temperature}
          onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Select Voice button */}
      <div className="text-center">
        <button
          onClick={() => {
            onSelectVoice(currentVoice.value);
            if (onClose) onClose(); 
          }}
          className={buttonClasses}
        >
          Select Voice
        </button>
      </div>
    </div>
  );
};

export default VoiceSettings;
