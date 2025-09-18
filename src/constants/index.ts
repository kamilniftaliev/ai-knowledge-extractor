import { Sentiment } from "@/types";

export const ERROR_MESSAGE = "Something went wrong. Please try again.";

export const DEFAULT_ARTICLES = [
  {
    id: "static-id-1",
    text: "",
  },
];

export const DEFAULT_LOADING_ANALYSES = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: "static-id-" + i,
    text: "",
  }));

export const BUTTON_ICON_SIZE = 20;

export const SENTIMENT_COLORS = {
  [Sentiment.Negative]: "failure",
  [Sentiment.Neutral]: "gray",
  [Sentiment.Positive]: "success",
};

export const ROW_CLASS = "dark:border-gray-700 dark:bg-gray-800";
