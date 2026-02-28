import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const userSession = await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*"],
};
