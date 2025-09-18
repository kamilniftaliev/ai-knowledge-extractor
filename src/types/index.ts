export type Article = {
  id: string;
  text: string;
};

export enum Sentiment {
  Positive = "Positive",
  Neutral = "Neutral",
  Negative = "Negative",
}

export type AiResponse = {
  id: string;
  nouns: string[];
  sentiment: Sentiment;
  summary: string;
  topics: string[];
  confidenceScore: number;
  error?: string;
};

export type ErrorResponse = {
  error: string;
};
