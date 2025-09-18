import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse, Sentiment } from "@/types";

const ai = new GoogleGenAI({});

export async function extractKnowledge(text: string) {
  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: text,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            title: "Summary",
            description:
              "Summary of the text in 1 or 2 short sentences. Maximum 20 words.",
          },
          sentiment: {
            type: Type.STRING,
            title: "Sentiment",
            description: "Sentiment of the given text",
            format: "enum",
            enum: [Sentiment.Positive, Sentiment.Neutral, Sentiment.Negative],
          },
          topics: {
            type: Type.ARRAY,
            title: "Topics",
            description: "3 key topics",
            items: {
              type: Type.STRING,
            },
          },
          nouns: {
            type: Type.ARRAY,
            title: "Nouns",
            description: "List of all single noun words",
            items: {
              type: Type.STRING,
              title: "Noun word",
              description: "A single noun word. Only 1 word.",
            },
          },
          confidenceScore: {
            type: Type.NUMBER,
            format: "float",
            minimum: 0,
            maximum: 1,
            title: "Confidence Score",
            description:
              "A floating-point value between 0 and 1 that represents how confident the AI model is in its prediction. A higher score indicates higher confidence in the result.",
          },
        },
      },
    },
  });

  if (!aiResponse.text) {
    return {
      error: "Error while extracting knowledge from AI model",
    };
  }

  const json = JSON.parse(aiResponse.text) as AiResponse;

  const topNouns = Object.entries(
    (json as AiResponse).nouns.reduce(
      (acc, noun) => {
        return {
          ...acc,
          [noun]: acc[noun] ? acc[noun] + 1 : 1,
        };
      },
      {} as Record<string, number>,
    ),
  )
    .toSorted((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([noun]) => noun);

  return {
    ...json,
    nouns: topNouns,
  };
}
