import { createContext, useContext } from "react";

// Create context for dashboard-wide state
export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);

export default function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within dashboard Dashboard Layout");
  }
  return context;
}
