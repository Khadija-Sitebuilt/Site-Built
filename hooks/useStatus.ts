import { StatusContext } from "@/contexts/status";
import { useContext } from "react";

export default function useStatus() {
  const context = useContext(StatusContext);

  if (!context) {
    throw new Error(
      "useStatus must be used within dashboard, projects and activity pages",
    );
  }

  return context;
}
