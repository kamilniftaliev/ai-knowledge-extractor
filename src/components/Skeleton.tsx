import { cn } from "@/utils";

interface Props {
  classes?: string;
}

export function Skeleton({ classes }: Props) {
  return (
    <div
      role="status"
      className={cn(
        "h-4 w-8 animate-pulse rounded-md bg-gray-300 duration-300 dark:bg-gray-700",
        classes,
      )}
    />
  );
}
