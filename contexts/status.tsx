import { createContext, ReactNode, useState } from "react";

// Create context for dashboard, projects, activity and reports state
export interface StatusContextType {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const StatusContext = createContext<StatusContextType | undefined>(
  undefined,
);

export function StatusContextProvider({ children }: { children: ReactNode }) {
  const [statusFilter, setStatusFilter] = useState("All Status");

  return (
    <StatusContext value={{ statusFilter, setStatusFilter }}>
      {children}
    </StatusContext>
  );
}
