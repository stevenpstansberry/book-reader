import React from "react";

interface VoiceSettingsProps {
  selectedVoice: string;
  onSelectVoice: (voice: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  selectedVoice,
  onSelectVoice,
  speed,
  onSpeedChange,
  temperature,
  onTemperatureChange,
}) => {
  return (
    <div className="flex flex-col space-y-3 p-3 w-full max-w-md border rounded-md shadow">
      <label className="flex flex-col">
        <span className="font-semibold">Voice Selection:</span>
        <select
          className="mt-1 p-2 border"
          value={selectedVoice}
          onChange={(e) => onSelectVoice(e.target.value)}
        >
          {VOICES.map((voice) => (
            <option key={voice.value} value={voice.value}>
              {voice.name} ({voice.style})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col">
        <span className="font-semibold">Speed: {speed.toFixed(2)}</span>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        />
      </label>

      <label className="flex flex-col">
        <span className="font-semibold">Temperature: {temperature.toFixed(2)}</span>
        <input
          type="range"
          min={0.0}
          max={1.0}
          step={0.1}
          value={temperature}
          onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
        />
      </label>
    </div>
  );
};


export const VOICES = [
  {
    name: "Angelo",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value: "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json",
    sample: "https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Angelo_Sample.wav",
    gender: "male",
    style: "Conversational",
  },
  {
    name: "Deedee",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value: "s3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/original/manifest.json",
    sample: "https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Deedee_Sample.wav",
    gender: "female",
    style: "Conversational",
  },
  {
    name: "Jennifer",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value: "s3://voice-cloning-zero-shot/801a663f-efd0-4254-98d0-5c175514c3e8/jennifer/manifest.json",
    sample: "https://peregrine-samples.s3.amazonaws.com/parrot-samples/jennifer.wav",
    gender: "female",
    style: "Conversational",
  },
  {
    name: "Briggs",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value: "s3://voice-cloning-zero-shot/71cdb799-1e03-41c6-8a05-f7cd55134b0b/original/manifest.json",
    sample: "https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Briggs_Sample.wav",
    gender: "male",
    style: "Narrative",
  },
  {
    name: "Samara",
    accent: "american",
    language: "English (US)",
    languageCode: "EN-US",
    value: "s3://voice-cloning-zero-shot/90217770-a480-4a91-b1ea-df00f4d4c29d/original/manifest.json",
    sample: "https://parrot-samples.s3.amazonaws.com/gargamel/Samara.wav",
    gender: "female",
    style: "Conversational",
  }
];

export default VoiceSettings;
