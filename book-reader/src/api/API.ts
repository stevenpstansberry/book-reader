import axios from "axios";

const PLAYAI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const PLAYAI_USER_ID = process.env.NEXT_PUBLIC_USER_ID;
const PLAYAI_BASE_URL = "https://api.play.ai/api/v1/tts/stream";

export const fetchTextToSpeech = async (
  text: string,
  voice: string,
  speed: number = 1,
  temperature: number = 0.7,
  voice2?: string, 
  turnPrefix?: string,
  turnPrefix2?: string
) => {
  console.log("📤 Sending request to PlayAI TTS API...");
  console.log("📝 Text:", text);
  console.log("🎙️ Selected Voice:", voice);
  console.log("⏩ Speed:", speed);
  console.log("🔥 Temperature:", temperature);
  console.log("🔄 Secondary Voice (if any):", voice2 || "None");
  console.log("🛠️ Additional Settings:", {
    turnPrefix: turnPrefix || "None",
    turnPrefix2: turnPrefix2 || "None",
  });

  try {
    const requestBody = {
      model: "PlayDialog",
      text,
      voice,
      voice2: voice2 || voice,
      outputFormat: "mp3",
      speed,
      sampleRate: 24000,
      seed: null,
      temperature,
      turnPrefix: turnPrefix || "",
      turnPrefix2: turnPrefix2 || "",
      prompt: "",
      prompt2: "",
      voiceConditioningSeconds: 20,
      voiceConditioningSeconds2: 20,
      language: "english",
    };

    console.log("📦 API Request Payload:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post(PLAYAI_BASE_URL, requestBody, {
      headers: {
        Authorization: `${PLAYAI_API_KEY}`,
        "X-USER-ID": PLAYAI_USER_ID!,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer", // Ensures we receive audio data as a buffer
    });

    console.log("✅ Response received from PlayAI!");
    console.log("🔎 Response Headers:", response.headers);
    console.log("📦 Response Data (audio buffer):", response.data ? "Received binary data ✅" : "No data ❌");

    return response.data; // Will return audio data as a buffer
  } catch (error: any) {
    console.error("❌ Error fetching TTS from PlayAI:", error);

    if (error.response) {
      console.error("🛑 API Error Status:", error.response.status);
      console.error("📝 API Error Data:", error.response.data);
      console.error("📩 API Error Headers:", error.response.headers);
    } else if (error.request) {
      console.error("⚠️ No response received from PlayAI:", error.request);
    } else {
      console.error("🔥 Error setting up request:", error.message);
    }

    throw error;
  }
};
