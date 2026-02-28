import { createContext, ReactNode, useState } from "react";

// Create context for dashboard page-wide state
export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext>
  );
}
