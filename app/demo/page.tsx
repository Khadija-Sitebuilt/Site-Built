"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://sitebuilt-backend.onrender.com";

export default function DemoPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [debugMessage, setDebugMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const sessionKey = "sitebuilt_demo_session_v1";

  useEffect(() => {
    let cancelled = false;

    async function signInDemo() {
      const supabase = createClient();

      const getStoredSession = () => {
        try {
          const raw = localStorage.getItem(sessionKey);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          if (!parsed?.email || !parsed?.password || !parsed?.expiresAt) {
            return null;
          }
          if (Date.now() > parsed.expiresAt) {
            localStorage.removeItem(sessionKey);
            return null;
          }
          return parsed as {
            email: string;
            password: string;
            expiresAt: number;
          };
        } catch {
          return null;
        }
      };

      const storeSession = (email: string, password: string) => {
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(
          sessionKey,
          JSON.stringify({ email, password, expiresAt }),
        );
      };

      const attemptSignIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { data, error };
      };

      const stored = getStoredSession();
      if (stored) {
        const { data, error } = await attemptSignIn(
          stored.email,
          stored.password,
        );
        if (!cancelled && !error && data.user) {
          router.push("/dashboard");
          return;
        }
        localStorage.removeItem(sessionKey);
      }

      try {
        const response = await fetch(`${backendUrl}/demo/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Demo session failed (${response.status})`);
        }
        const credentials = await response.json();
        const { data, error } = await attemptSignIn(
          credentials.email,
          credentials.password,
        );

        if (cancelled) {
          return;
        }

        if (error || !data.user) {
          setStatus("error");
          setErrorMessage(
            error?.message || "Unable to sign in to demo workspace.",
          );
          setDebugMessage(
            error?.message ? `Supabase error: ${error.message}` : "",
          );
          return;
        }

        storeSession(credentials.email, credentials.password);
        router.push("/dashboard");
      } catch (sessionError: any) {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(
          sessionError?.message || "Unable to create demo session.",
        );
      }
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
