import { createContext, useContext } from "react";

// Create context for dashboard, projects and activity state
export interface StatusContextType {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const StatusContext = createContext<StatusContextType | undefined>(
  undefined,
);

export default function useStatus() {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error(
      "useStatus must be used within dashboard, projects and activity pages",
    );
  }
  return context;
}
