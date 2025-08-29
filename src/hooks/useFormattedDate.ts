import { useMemo } from "react";

export function useFormattedDate(date: string | null | undefined) {
  return useMemo(() => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [date]);
}
