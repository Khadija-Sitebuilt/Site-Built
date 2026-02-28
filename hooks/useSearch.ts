import { SearchContext } from "@/contexts/search";
import { useContext } from "react";

export default function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within dashboard Dashboard Layout");
  }

  return context;
}
