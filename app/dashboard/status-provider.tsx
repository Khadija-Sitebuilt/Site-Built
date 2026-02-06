import { StatusContext } from "@/hooks/useStatus";
import { useState } from "react";

export default function StatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statusFilter, setStatusFilter] = useState("All Status");

  return (
    <StatusContext value={{ statusFilter, setStatusFilter }}>
      {children}
    </StatusContext>
  );
}
