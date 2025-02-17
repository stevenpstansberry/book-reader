// utils/audioUtilities.js
import { RefObject, SetStateAction } from "react";
import { fetchTextToSpeech } from "../api/API";

/**
 * Fetch TTS audio for a given page of text and cache the result.
 */
export async function fetchAndCacheAudio(
  pageNumber: number,
  text: string,
  audioCache: { [x: string]: any; },
  selectedVoice: string,
  speed: number | undefined,
  temperature: number | undefined,
  cancelRef: { current: any; }
) {
  if (cancelRef.current) return null;

  // If already cached, return existing audio
  if (audioCache[pageNumber]) {
    return audioCache[pageNumber];
  }

  try {
    const audioData = await fetchTextToSpeech(text, selectedVoice, speed, temperature);
    if (cancelRef.current) return null;

    const blob = new Blob([audioData], { type: "audio/mp3" });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Error generating TTS for page ${pageNumber}:`, error);
    return null;
  }
}

/**
 * Given a dictionary of textByPage, generate audio for each page and update progress.
 */
export async function handleTextExtracted(
  textByPage: string[],
  cancelRef: RefObject<boolean>,
  setGeneratingAudio: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; },
  setAudioProgress: { (value: SetStateAction<number>): void; (arg0: number): void; },
  audioCache: { [key: number]: string; },
  setAudioCache: { (value: SetStateAction<{ [key: number]: string; }>): void; (arg0: any): void; },
  selectedVoice: string,
  speed: number | undefined,
  temperature: number | undefined
) {
  cancelRef.current = false; // new generation in progress
  setGeneratingAudio(true);
  setAudioProgress(0);

  const newAudioCache = { ...audioCache };
  const totalPages = Object.keys(textByPage).length;

  // We'll track how many pages we've processed for progress
  let processedPages = 0;

  // Convert to numeric page indices
  const pageNumbers = Object.keys(textByPage).map(Number);

  // Run TTS calls in parallel
  const promises = pageNumbers.map(async (pageNumber) => {
    if (cancelRef.current) return;

    if (!newAudioCache[pageNumber]) {
      const audioUrl = await fetchAndCacheAudio(
        pageNumber,
        textByPage[pageNumber],
        newAudioCache,
        selectedVoice,
        speed,
        temperature,
        cancelRef
      );

      if (!cancelRef.current && audioUrl) {
        newAudioCache[pageNumber] = audioUrl;
      }
    }

    processedPages += 1;
    setAudioProgress(Math.round((processedPages / totalPages) * 100));
  });

  // Wait for all
  await Promise.all(promises);

  // If not canceled, finalize
  if (!cancelRef.current) {
    setAudioCache(newAudioCache);
    setGeneratingAudio(false);
  }
}
