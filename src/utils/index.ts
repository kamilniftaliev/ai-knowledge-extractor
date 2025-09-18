import { AiResponse } from "@/types";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: (string | false | undefined | null)[]) {
  // Use clsx to handle conditional classnames and twMerge to merge conflicting Tailwind classes
  return twMerge(clsx(...classes));
}

export function getConfidenceBadgeColor(
  confidenceScore: AiResponse["confidenceScore"],
) {
  if (confidenceScore > 0.8) {
    return "success";
  }

  if (confidenceScore > 0.5) {
    return "default";
  }

  if (confidenceScore > 0.2) {
    return "warning";
  }

  return "failure";
}
