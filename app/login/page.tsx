"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing window
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const resetStatus = searchParams.get("reset");
    const callbackError = searchParams.get("error");

    if (resetStatus === "success") {
      setNotice(
        "Password updated successfully. Sign in with your new password.",
      );
    } else {
      setNotice("");
    }

    if (callbackError) {
      setError(callbackError);
    }
  }, [searchParams, mounted]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } =
        await createClient().auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      if (data.user) {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/signin/signinbg.png')" }}
    >
      <div className="hidden lg:flex lg:w-[50%] relative">
        <Image
          src="/images/signin/construct.png"
          alt="Construction site with digital overlay"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex w-full lg:w-[50%] items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6 relative">
            <div className="flex justify-center mb-2.25">
              <Link
                href="/"
                className="inline-block transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src="/images/sitebuilt.svg"
                  alt="SiteBuilt Logo"
                  width={120}
                  height={40}
                  className="h-7.5"
                />
              </Link>
            </div>

            <div className="text-center mb-2.25">
              {/* <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1> */}
              <p className="text-gray-600 text-sm mt-2 leading-6.75">
                Welcome back. Continue where you left off.
              </p>
            </div>

            {notice && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">{notice}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form
              className="space-y-6.5 my-8.75 border p-5.5 rounded-2xl border-[#16a34a]/5 shadow-[0_1px_3px_#0000001a,0_1px_2px_-1px_#0000001a]"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#030213] mb-2.25 text-[0.9375rem]"
                >
                  Work Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@domain.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#030213] mb-2.25 text-[0.9375rem]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-[0.9375rem] text-[#475569]  cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/reset-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign in"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </form>

            <div className="mt-6 space-y-3 text-center">
              {/* <div>
                <Link
                  href="/reset-password"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot your password?
                </Link>
              </div> */}
              <div className="text-sm text-gray-600">
                New here?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
