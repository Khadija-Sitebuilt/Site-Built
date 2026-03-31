"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || "";
const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "";
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://sitebuilt-backend.onrender.com";

export default function DemoPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [debugMessage, setDebugMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function signInDemo() {
      if (!demoEmail || !demoPassword) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            "Demo is not configured yet. Please contact us or sign in.",
          );
          setDebugMessage(
            `Demo email set: ${demoEmail ? "yes" : "no"} | Demo password set: ${demoPassword ? "yes" : "no"}`,
          );
        }
        return;
      }

      const { data, error } = await createClient().auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (cancelled) {
        return;
      }

      if (error || !data.user) {
        setStatus("error");
        setErrorMessage(
          error?.message || "Unable to sign in with demo credentials.",
        );
        setDebugMessage(
          [
            `Demo email set: ${demoEmail ? "yes" : "no"}`,
            `Demo password set: ${demoPassword ? "yes" : "no"}`,
            error?.message ? `Supabase error: ${error.message}` : "",
            error?.status ? `Supabase status: ${error.status}` : "",
            error?.name ? `Supabase name: ${error.name}` : "",
          ]
            .filter(Boolean)
            .join(" | "),
        );
        return;
      }

      try {
        await fetch(`${backendUrl}/demo/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": data.user.id,
            "X-User-Email": data.user.email || "",
          },
        });
      } catch (resetError) {
        console.error("Demo reset failed:", resetError);
      }

      router.push("/dashboard");
    }

    signInDemo();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Demo</h1>
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Signing you in to the demo workspace...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            {debugMessage && (
              <p className="text-xs text-gray-500 mb-4 break-words">
                {debugMessage}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Go to Sign In
              </Link>
              <Link
                href="/#contact"
                className="text-blue-600 font-medium hover:text-blue-500"
              >
                Contact us
              </Link>
            </div>
          </>
        )}
        <div className="mt-6">
          <button
            type="button"
            onClick={async () => {
              setLoggingOut(true);
              try {
                await createClient().auth.signOut();
              } finally {
                router.push("/login");
              }
            }}
            disabled={loggingOut}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
