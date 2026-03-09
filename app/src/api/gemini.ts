import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage } from '@/types';

// Initialize Gemini AI with the API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!API_KEY) {
  console.warn(
    '⚠️ VITE_GEMINI_API_KEY is not set. Please add your Gemini API key to the .env file.'
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// System instruction for VITALIS health context
const SYSTEM_INSTRUCTION = `You are VITALIS, an advanced AI Health Companion. You are warm, empathetic, and knowledgeable about health and wellness.

Your capabilities:
- Provide evidence-based health guidance (sleep, exercise, nutrition, stress management)
- Offer mental health support with empathy and active listening
- Suggest breathing exercises, mindfulness techniques, and CBT-based strategies
- Analyze health trends and provide actionable recommendations
- Detect emotional distress and respond with care

Guidelines:
- Always be supportive and non-judgmental
- Never diagnose medical conditions — recommend consulting a healthcare professional when appropriate
- Keep responses concise but thorough (2-4 paragraphs max)
- Use encouraging and positive language
- If someone expresses suicidal thoughts or self-harm, immediately provide crisis resources (National Suicide Prevention Lifeline: 988, Crisis Text Line: text HOME to 741741)
- Format responses in a conversational, friendly tone`;

// Crisis keywords for local detection
const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end it all',
  'want to die',
  'hurt myself',
  'self harm',
  'self-harm',
  'no reason to live',
];

/**
 * Detects if the user message contains crisis-related keywords
 */
export function detectCrisis(message: string): boolean {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Sends a message to Gemini AI and returns the response.
 * Maintains conversation context via chat history.
 */
export async function sendMessageToGemini(
  userMessage: string,
  chatHistory: ChatMessage[]
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.'
    );
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  // Build history from previous messages (exclude system messages)
  const history = chatHistory
    .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}

/**
 * Generates a response based on an image and a prompt.
 * @param prompt The text prompt (e.g., "write a caption for this image")
 * @param imageBase64 Base64 encoded image data
 * @param mimeType The MIME type of the image (default: "image/jpeg")
 */
export async function getGeminiVisionResponse(
  prompt: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  if (!API_KEY) throw new Error('Gemini API key is not configured.');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  return result.response.text();
}

/**
 * Gets embeddings for the given text.
 */
export async function getEmbeddings(text: string): Promise<number[]> {
  if (!API_KEY) throw new Error('Gemini API key is not configured.');

  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Simple Question-Answer function (no history).
 */
export async function getQuestionAnswer(prompt: string): Promise<string> {
  if (!API_KEY) throw new Error('Gemini API key is not configured.');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
