
import { GoogleGenAI, Type } from "@google/genai";
import type { Medication, ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const medicationSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'The common brand name or generic name of the medication. If unknown, return "Unknown".' },
    description: { type: Type.STRING, description: 'A brief description of what the medication is used for.' },
    dosage: { type: Type.STRING, description: 'Common dosage information or instructions.' },
    sideEffects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of common side effects.'
    },
    warnings: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A list of important warnings or contraindications.'
    }
  },
  required: ['name', 'description', 'dosage', 'sideEffects', 'warnings']
};

export async function identifyMedication(base64Image: string): Promise<Medication> {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Please identify the medication in this image. Provide its name, a brief description, common dosage, typical side effects, and any important warnings. If you cannot identify the medication with high confidence, set the name to "Unknown".`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: medicationSchema
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Medication;

  } catch (error) {
    console.error("Error identifying medication:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
}

export async function chatWithAI(history: ChatMessage[], newMessage: string, medicationInfo: Medication): Promise<string> {
  const systemInstruction = `You are Pill Pal, a friendly and knowledgeable AI pharmacy assistant. The user is asking about the medication: ${medicationInfo.name}. 
    
    Here is the information we have identified:
    - Description: ${medicationInfo.description}
    - Dosage: ${medicationInfo.dosage}
    - Side Effects: ${medicationInfo.sideEffects.join(', ')}
    - Warnings: ${medicationInfo.warnings.join(', ')}

    Your role is to answer the user's questions based on this information and your general knowledge.
    IMPORTANT: You must never provide medical advice. Always end your responses with a disclaimer to consult a healthcare professional. Be helpful, clear, and concise.`;

  const chatHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text;

  } catch (error) {
    console.error("Error in chatWithAI:", error);
    return "I'm sorry, I encountered an error. Please try again.";
  }
}
