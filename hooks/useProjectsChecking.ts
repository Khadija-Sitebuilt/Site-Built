import { ProjectsCheckingContext } from "@/contexts/projectsChecking";
import { useContext } from "react";

export default function useProjectsChecking() {
  const context = useContext(ProjectsCheckingContext);

  if (!context) {
    throw new Error("useProjects must be used within dashboard");
  }

  return context;
}
