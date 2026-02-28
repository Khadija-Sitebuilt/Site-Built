import { createContext, ReactNode, useState } from "react";

// Create context for projects state
export interface ProjectsCheckingContextType {
  hasProjects: boolean;
  setHasProjects: (val: boolean) => void;
}

export const ProjectsCheckingContext = createContext<
  ProjectsCheckingContextType | undefined
>(undefined);

export function ProjectsCheckingContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hasProjects, setHasProjects] = useState(false);

  return (
    <ProjectsCheckingContext value={{ hasProjects, setHasProjects }}>
      {children}
    </ProjectsCheckingContext>
  );
}
